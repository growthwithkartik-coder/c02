import cv2, numpy as np, json, os
P='/home/claude/src/co2/public/'
al=json.load(open('align.json'))
for slug,(sc0,pf,s,(x,y)) in al.items():
    c=cv2.imread(P+f'campaign/{slug}.webp',cv2.IMREAD_UNCHANGED); im=cv2.imread(pf)
    best=None
    for ss in ([s] if abs(s-1)<1e-6 else np.linspace(s-0.03,s+0.03,13)):
        t=cv2.resize(c,None,fx=ss,fy=ss,interpolation=cv2.INTER_AREA) if ss!=1 else c
        a=t[...,3]; rgb=t[...,:3]
        X0=int(max(0,x-8)); Y0=int(max(0,y-8)); X1=min(im.shape[1],int(x)+t.shape[1]+8); Y1=min(im.shape[0],int(y)+t.shape[0]+8)
        reg=im[Y0:Y1,X0:X1]
        if reg.shape[0]<t.shape[0] or reg.shape[1]<t.shape[1]: continue
        r=cv2.matchTemplate(reg,rgb,cv2.TM_SQDIFF,mask=cv2.merge([a]*3))
        mn,_,ml,_=cv2.minMaxLoc(r); sco=mn/(a>0).sum()
        if best is None or sco<best[0]: best=(sco,ss,X0+ml[0],Y0+ml[1],t)
    sco,ss,bx,by,t=best
    a=t[...,3]
    crop=im[by:by+t.shape[0],bx:bx+t.shape[1]]
    # per-pixel difference outside the logo indicates alignment quality
    d=np.abs(crop.astype(int)-t[...,:3].astype(int)).max(2)
    med=np.median(d[a>200])
    out=np.dstack([crop,a])
    if ss!=1: out=cv2.resize(out,(c.shape[1],c.shape[0]),interpolation=cv2.INTER_CUBIC); out[...,3]=c[...,3]
    edge=(c[...,3]<250)
    out[...,:3][edge]=c[...,:3][edge]
    cv2.imwrite(f'cut-out/{slug}.png',out)
    print(slug,os.path.basename(pf),round(ss,3),bx,by,'medianDiff',med,'score',round(sco))
