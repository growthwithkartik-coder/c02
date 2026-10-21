import cv2, numpy as np, glob, sys, os
P='/home/claude/src/co2/public/'
res={}
for f in sorted(glob.glob(P+'campaign/*.webp')):
    slug=os.path.basename(f)[:-5]
    c=cv2.imread(f,cv2.IMREAD_UNCHANGED); a=c[...,3]; rgb=c[...,:3]
    best=None
    for pf in sorted(glob.glob(P+f'products/{slug}-*-1200.webp')):
        im=cv2.imread(pf)
        for sc in np.linspace(0.5,1.6,45):
            t=cv2.resize(rgb,None,fx=sc,fy=sc); m=cv2.resize(a,None,fx=sc,fy=sc)
            if t.shape[0]>im.shape[0] or t.shape[1]>im.shape[1]: continue
            # downsample for speed
            k=0.35
            ts=cv2.resize(t,None,fx=k,fy=k); ms=cv2.resize(m,None,fx=k,fy=k); ims=cv2.resize(im,None,fx=k,fy=k)
            if ts.shape[0]>=ims.shape[0] or ts.shape[1]>=ims.shape[1]: continue
            r=cv2.matchTemplate(ims,ts,cv2.TM_SQDIFF,mask=cv2.merge([ms]*3))
            mn,_,ml,_=cv2.minMaxLoc(r); score=mn/ (ms>0).sum()
            if best is None or score<best[0]: best=(score,pf,sc,(ml[0]/k,ml[1]/k))
    res[slug]=best; print(slug,best,flush=True)
import json; json.dump({k:[v[0],v[1],v[2],v[3]] for k,v in res.items()},open('align.json','w'),indent=1)
