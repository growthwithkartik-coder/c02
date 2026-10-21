import cv2, numpy as np, json, sys
from PIL import Image
D='drive/'
tpl=cv2.imread(D+'Aloe Vera Gel.jpg')[188:350,430:624]
def edges(im):
    g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY); return cv2.Canny(g,60,160)
te=edges(tpl)
files=json.load(open('work/targets.json'))
out={}
for f in files:
    im=cv2.imread(D+f); H,W=im.shape[:2]
    s0=1024/W
    imr=cv2.resize(im,(int(W*s0),int(H*s0))) if s0!=1 else im
    ie=cv2.GaussianBlur(edges(imr).astype(np.float32),(5,5),0)
    best=[]
    for sc in np.linspace(0.35,1.5,47):
        t=cv2.resize(te,None,fx=sc,fy=sc).astype(np.float32); t=cv2.GaussianBlur(t,(5,5),0)
        if t.shape[0]>=ie.shape[0] or t.shape[1]>=ie.shape[1]: continue
        r=cv2.matchTemplate(ie,t,cv2.TM_CCOEFF_NORMED)
        _,mv,_,ml=cv2.minMaxLoc(r)
        best.append((mv,sc,ml,t.shape))
    best.sort(reverse=True)
    mv,sc,(x,y),(h,w)=best[0]
    out[f]=dict(score=float(mv),box=[x/s0,y/s0,(x+w)/s0,(y+h)/s0])
    print(f, round(mv,3), round(sc,2), [round(v) for v in out[f]['box']])
json.dump(out,open('work/found.json','w'),indent=1)
