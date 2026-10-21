# Replace AI-rendered "CO2 COSMETICS" pack marks with the official CO2 logo.
# erase: rough rects; mark components (not touching the rect border) are detected,
# masked and inpainted. logo: rough rect whose detected bbox receives the logo.
import cv2, numpy as np, json, sys, os
from PIL import Image
D=sys.argv[1]; OUT=sys.argv[2]; LOGO=sys.argv[3]; os.makedirs(OUT,exist_ok=True)
spec=json.load(open(os.environ.get('SPEC','spec3.json')))
logo=Image.open(LOGO).convert('RGBA'); logo=logo.crop(logo.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox())
def detect(img,r,thr,k,poly=None):
    x0,y0,x1,y1=r; reg=img[y0:y1,x0:x1]
    kk=k|1
    bg=cv2.medianBlur(reg,kk)
    diff=np.abs(reg.astype(int)-bg.astype(int)).max(axis=2)
    m=(diff>thr).astype(np.uint8)
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
    H,W=m.shape
    if poly is not None:
        pm=np.zeros_like(m); cv2.fillPoly(pm,[np.array(poly,np.int32)-[x0,y0]],1); m&=pm
        n,lab,st,_=cv2.connectedComponentsWithStats(m,8); keep=np.zeros_like(m)
        for i in range(1,n):
            if st[i][4]>=6: keep[lab==i]=1
        full=np.zeros(img.shape[:2],np.uint8); full[y0:y1,x0:x1]=keep; return full
    def inner(mm,minA):
        n,lab,st,_=cv2.connectedComponentsWithStats(mm,8); k=np.zeros_like(mm)
        for i in range(1,n):
            x,y,w,h,a=st[i]
            if x<=1 or y<=1 or x+w>=W-1 or y+h>=H-1 or a<minA: continue
            k[lab==i]=1
        return k
    keep=inner(m,6)
    mo=cv2.morphologyEx(m,cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5)))
    ko=inner(mo,40)
    keep|=m&cv2.dilate(ko,np.ones((9,9),np.uint8))
    full=np.zeros(img.shape[:2],np.uint8); full[y0:y1,x0:x1]=keep
    return full
only=sys.argv[4:]
for f,s in spec.items():
    if only and f not in only: continue
    img=cv2.imread(os.path.join(D,f))
    mask=np.zeros(img.shape[:2],np.uint8)
    for e in s['erase']:
        dm=detect(img,e['r'],e.get('thr',28),e.get('k',41),e.get('poly'))
        if e.get('hull',s.get('hull',False)):
            ys,xs=np.where(dm); pts=np.stack([xs,ys],1).astype(np.int32)
            cv2.fillConvexPoly(dm,cv2.convexHull(pts),1)
        mask|=dm
    boxes=[]
    for L in s['logo']:
        m=detect(img,L['r'],L.get('thr',28),L.get('k',41),L.get('poly'))
        ys,xs=np.where(m); boxes.append([xs.min(),ys.min(),xs.max()+1,ys.max()+1])
    d=s.get('dil',4)
    mask=cv2.dilate(mask*255,np.ones((2*d+1,2*d+1),np.uint8))
    for cx,cy,rx,ry in s.get('stars',[]):  # image-generator sparkle watermark (astroid shape)
        t=np.linspace(0,2*np.pi,200)
        pts=np.stack([cx+rx*np.cos(t)**3*1.0,cy+ry*np.sin(t)**3],1)
        sm=np.zeros(mask.shape,np.uint8); cv2.fillPoly(sm,[pts.round().astype(np.int32)],255)
        mask|=cv2.dilate(sm,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9)))
    for r in s.get('wipe',[]):  # whole-rect wipes, not dilated
        x0,y0,x1,y1=r; mask[y0:y1,x0:x1]=255
    img=cv2.inpaint(img,mask,s.get('rad',7),cv2.INPAINT_TELEA)
    for x0,y0,x1,y1 in s.get('soften',[]):  # blur inpainted pixels inside an out-of-focus background area
        w=np.zeros(mask.shape,np.float32); w[y0:y1,x0:x1]=(mask[y0:y1,x0:x1]>0)
        w=cv2.GaussianBlur(cv2.dilate(w,np.ones((9,9),np.uint8)),(0,0),5)[...,None]
        img=(cv2.GaussianBlur(img,(0,0),9)*w+img*(1-w)).astype(np.uint8)
    for x0,y0,x1,y1 in s.get('vfill',[]):  # vertical interpolation between clean rows y0-1 and y1
        top=cv2.GaussianBlur(img[y0-3:y0,x0:x1].astype(np.float32).mean(0)[None],(0,0),5)[0]
        bot=cv2.GaussianBlur(img[y0-8:y0-4,x0:x1].astype(np.float32).mean(0)[None],(0,0),5)[0]
        t=np.linspace(0,1,y1-y0+2)[1:-1][:,None,None]
        img[y0:y1,x0:x1]=(top[None]*(1-t)+bot[None]*t).astype(np.uint8)
    pil=Image.fromarray(cv2.cvtColor(img,cv2.COLOR_BGR2RGB)).convert('RGBA')
    for (x0,y0,x1,y1),L in zip(boxes,s['logo']):
        sc=min((x1-x0)/logo.width,(y1-y0)/logo.height)*L.get('scale',1.0)
        Lg=logo.resize((round(logo.width*sc),round(logo.height*sc)),Image.LANCZOS)
        pil.alpha_composite(Lg,(round((x0+x1)/2-Lg.width/2),round((y0+y1)/2-Lg.height/2)))
    s['logo_boxes']=[list(map(int,b)) for b in boxes]
    pil.convert('RGB').save(os.path.join(OUT,os.path.splitext(f)[0]+'.png'))
    cv2.imwrite(os.path.join(OUT,'mask-'+os.path.splitext(f)[0]+'.png'),mask)
    print('ok',f,s['logo_boxes'])
json.dump(spec,open(os.path.join(OUT,'spec_used.json'),'w'),indent=1)
