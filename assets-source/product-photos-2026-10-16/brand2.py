import cv2, numpy as np, json, os, sys
from PIL import Image
D='drive/'; OUT='work/branded/'; os.makedirs(OUT,exist_ok=True)
spec=json.load(open('work/spec.json'))
SOAPS={"Kumkumadi Soap.jpg","Neem Soap.jpg","Papaya Soap.jpg","Red Wine Soap.jpg","Sandal Soap.jpg","Sunni Pindi Soap.jpg","Turmeric Soap.jpg","Beetroot Soap Natural Beauty Still Life.png"}
logo=Image.open('site/co2/public/brand/co2-logo-360.png').convert('RGBA')
logo=logo.crop(logo.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox())
def hfill(img,x0,y0,x1,y1,s=6):
    f=img.astype(np.float32).copy()
    L=np.median(img[y0:y1,max(0,x0-s):x0],axis=1); R=np.median(img[y0:y1,x1:x1+s],axis=1)
    L=cv2.GaussianBlur(L[None],(0,0),(0.1,4))[0] if False else L
    t=np.linspace(0,1,x1-x0)[None,:,None]
    band=L[:,None,:]*(1-t)+R[:,None,:]*t
    band=cv2.GaussianBlur(band.astype(np.float32),(0,0),sigmaX=0.5,sigmaY=3)
    f[y0:y1,x0:x1]=band
    return f
def clean(img,box,pad,thr=24,full_fill=False):
    H,W=img.shape[:2]
    x0,y0,x1,y1=[int(round(v)) for v in box]
    x0=max(6,x0-pad[0]);y0=max(0,y0-pad[1]);x1=min(W-6,x1+pad[0]);y1=min(H,y1+pad[3] if len(pad)>3 else y1+pad[1])
    bg=hfill(img,x0,y0,x1,y1)
    if full_fill:
        m=np.zeros((H,W),np.float32); m[y0:y1,x0:x1]=1
    else:
        diff=np.abs(img.astype(np.float32)-bg).max(axis=2)
        m=np.zeros((H,W),np.uint8); m[y0:y1,x0:x1]=(diff[y0:y1,x0:x1]>thr)*255
        m=cv2.dilate(m,np.ones((3,3),np.uint8),iterations=3)
        m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((7,7),np.uint8))
        lim=np.zeros_like(m); lim[y0:y1,x0:x1]=255; m&=lim
        m=m.astype(np.float32)/255
    m=cv2.GaussianBlur(m,(0,0),2.0)[...,None]
    return (bg*m+img*(1-m)).clip(0,255).astype(np.uint8)
def find_band(img,box):
    x0,y0,x1,y1=[int(round(v)) for v in box]; h=y1-y0
    X0,X1=x0-40,x1+40; Y0,Y1=y1+4,y1+int(h*.42)
    bg=hfill(img,X0,Y0,X1,Y1)
    diff=np.abs(img.astype(np.float32)-bg).max(axis=2)[Y0:Y1,X0:X1]
    rows=(diff>30).sum(axis=1)
    on=rows>6; runs=[];start=None
    for i,v in enumerate(on):
        if v and start is None: start=i
        if not v and start is not None: runs.append((start,i)); start=None
    if start is not None: runs.append((start,len(on)))
    runs=[r for r in runs if r[1]-r[0]>=4]
    # first run whose start is after Cosmetics tail (skip run touching top)
    r=[r for r in runs if r[0]>3] or runs
    a,b=r[0]
    cols=np.where((diff[a:b]>30).sum(axis=0)>0)[0]
    return [X0+cols.min()-4, Y0+a-3, X0+cols.max()+5, Y0+b+2]
only=sys.argv[1:]
for f,s in spec.items():
    if only and f not in only: continue
    img=cv2.imread(D+f)
    erase=list(s['erase'])
    if f in SOAPS and f!="Beetroot Soap Natural Beauty Still Life.png":
        b0=s['logos'][0]; erase=[[b0[0]-28,b0[3]+16,b0[2]+25,b0[3]+43]]
    s['erase_used']=erase
    for b in erase: img=clean(img,b,(0,0),full_fill=('Soap' in f))
    for b in s['logos']:
        w,h=b[2]-b[0],b[3]-b[1]
        img=clean(img,b,(int(w*.05)+3,0,0,int(h*.04)+3),thr=34 if f in SOAPS else 24)
    pil=Image.fromarray(cv2.cvtColor(img,cv2.COLOR_BGR2RGB)).convert('RGBA')
    for b in s['logos']:
        x0,y0,x1,y1=b; bw=(x1-x0)*1.04; bh=(y1-y0)*1.04
        sc=min(bw/logo.width,bh/logo.height); Lg=logo.resize((round(logo.width*sc),round(logo.height*sc)),Image.LANCZOS)
        pil.alpha_composite(Lg,(round((x0+x1)/2-Lg.width/2),round((y0+y1)/2-Lg.height/2)))
    pil.convert('RGB').save(OUT+os.path.splitext(f)[0]+'.png')
    print('ok',f,erase)
json.dump(spec,open("work/spec_used.json","w"),indent=1,default=int)
