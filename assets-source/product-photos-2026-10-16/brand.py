import cv2, numpy as np, json, os, sys
from PIL import Image
D='drive/'; OUT='work/branded/'; os.makedirs(OUT,exist_ok=True)
found=json.load(open('work/found.json'))
logo=Image.open('site/co2/public/brand/co2-logo-360.png').convert('RGBA')
# crop logo to its alpha bbox
logo=logo.crop(logo.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox())
SOAPS={"Kumkumadi Soap.jpg","Neem Soap.jpg","Papaya Soap.jpg","Red Wine Soap.jpg","Sandal Soap.jpg","Sunni Pindi Soap.jpg","Turmeric Soap.jpg"}
spec={}
for f,v in found.items():
    x0,y0,x1,y1=v['box']; spec[f]={'logos':[[x0,y0,x1,y1]],'erase':[]}
    if f in SOAPS: spec[f]['erase'].append([x0-32,y1+12,x1+32,y1+43])
spec["Onion Hair Oil.jpg"]['logos'].append([270,380,372,472])
spec["White Petroleum Jelly.jpg"]={'logos':[[568,465,710,602],[198,583,278,683]],'erase':[[875,875,935,935]]}
spec["Beetroot Soap Natural Beauty Still Life.png"]={'logos':[[520,180,712,352]],'erase':[[484,364,744,398]]}
if len(sys.argv)>1: spec={k:spec[k] for k in sys.argv[1:]}
def clean(img,box,pad,thr=26):
    H,W=img.shape[:2]
    x0,y0,x1,y1=[int(round(v)) for v in box]
    x0=max(0,x0-pad[0]);y0=max(0,y0-pad[1]);x1=min(W,x1+pad[0]);y1=min(H,y1+pad[1])
    full=np.zeros((H,W),np.uint8); full[y0:y1,x0:x1]=255
    bg=cv2.inpaint(img,full,21,cv2.INPAINT_NS)
    bg=cv2.GaussianBlur(bg,(0,0),3)
    diff=np.abs(img.astype(int)-bg.astype(int)).max(axis=2).astype(np.uint8)
    m=((diff>thr)&(full>0)).astype(np.uint8)*255
    m=cv2.dilate(m,np.ones((5,5),np.uint8),iterations=2)
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
    m&=full
    out=cv2.inpaint(img,m,9,cv2.INPAINT_TELEA)
    # feather: blend inpainted region onto original
    a=cv2.GaussianBlur(m.astype(np.float32)/255,(0,0),1.5)[...,None]
    return (out*a+img*(1-a)).astype(np.uint8)
for f,s in spec.items():
    img=cv2.imread(D+f)
    for b in s['erase']: img=clean(img,b,(2,2),thr=22)
    for b in s['logos']:
        w,h=b[2]-b[0],b[3]-b[1]
        img=clean(img,b,(int(w*.06)+4,int(h*.05)+4))
    pil=Image.fromarray(cv2.cvtColor(img,cv2.COLOR_BGR2RGB)).convert('RGBA')
    for b in s['logos']:
        x0,y0,x1,y1=b; bw=(x1-x0)*1.04; bh=(y1-y0)*1.04
        sc=min(bw/logo.width,bh/logo.height); L=logo.resize((max(1,round(logo.width*sc)),max(1,round(logo.height*sc))),Image.LANCZOS)
        cx=(x0+x1)/2; cy=(y0+y1)/2
        pil.alpha_composite(L,(round(cx-L.width/2),round(cy-L.height/2)))
    pil.convert('RGB').save(OUT+os.path.splitext(f)[0]+'.png')
    print('ok',f)
json.dump(spec,open('work/spec.json','w'),indent=1)
