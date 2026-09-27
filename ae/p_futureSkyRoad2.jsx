// Phase 2: native AE layouts, atmospheric decorations and gentle motion.
// No semantic rules: the showcase uses ordinary per-line overrides.
function fsr2_split(text) {
    var words = jzTrim(text).split(/\s+/), best=1, distance=1e9, i, d;
    if(words.length>1){
        for(i=1;i<words.length;i++){
            d=Math.abs(jzCount(words.slice(0,i).join(' '))-jzCount(words.slice(i).join(' ')));
            if(d<distance){best=i;distance=d;}
        }
        return [words.slice(0,best).join(' '),words.slice(best).join(' ')];
    }
    var n=jzCount(text);
    if(n<2)return [text];
    var lines=jzSplitLines(text,Math.ceil(n/2)).split('\r');
    if(lines.length<=2)return lines;
    var mid=Math.ceil(lines.length/2);
    return [lines.slice(0,mid).join(''),lines.slice(mid).join('')];
}
function fsr2_plan(kind, rng, cut, st) {
    var right = rng.chance(0.5), port = cut.H > cut.W, font = rng.pick(st.fonts.display), track = rng.range(0.09, 0.13), items, parts, i;
    function item(text,x,y,w,h,size,align,mi,rot) { return {text:text,x:x,y:y,w:w,h:h,size:size,align:align||'left',mi:mi||0,rot:rot||0,track:track}; }
    if (kind === 'fsrOpenSky') items = [item(jzSplitLines(cut.text,port?8:18),right?0.86:0.14,right?0.72:0.64,0.7,0.25,0.071,right?'right':'left')];
    else if (kind === 'fsrLowGround') { items = [item(jzSplitLines(cut.text,port?8:12),right?0.84:0.16,0.78,0.68,0.25,0.066,right?'right':'left')]; items[0].track=0.065; }
    else if (kind === 'fsrDriftingMemory') { items = [item(jzSplitLines(cut.text,port?8:17),right?0.84:0.16,right?0.37:0.43,0.66,0.3,0.073,right?'right':'left')]; items[0].track=0.15;items[0].memory=true; }
    else {
        parts=fsr2_split(cut.text);items=[];
        for(i=0;i<parts.length;i++) items.push(kind==='fsrParallelJourney'
            ? item(jzSplitLines(parts[i],port?7:13),i?0.27:0.17,i?0.62:0.4,0.58,0.17,0.069,'left',i*4,-1.2)
            : item(jzSplitLines(parts[i],port?6:11),i?0.59:0.37,i?0.59:0.42,port?0.61:0.47,0.18,0.068,'center',i*4,i?-1:1.3));
    }
    return {font:font,right:right,items:items};
}
function fsr2_line(ctx,name,pts,alpha) {
    var L=jzShapeLayer(ctx,name,0,0),g=jzGrp(L,name);
    jzAddPath(g,pts,false);jzAddStroke(g,ctx.sc.sub,jzU(ctx)*0.001);
    jzXf(L,'ADBE Opacity').setValue(alpha*100);jzFade(ctx,L,0,0.85);jzNoGhost(L);return L;
}
function fsr2_text(ctx,p,font,echo) {
    var U=jzU(ctx),s=U*p.size,o={font:font,size:s,color:echo?ctx.sc.sub:ctx.sc.fg,
        x:ctx.W*(p.x-(echo?0.014:0)),y:ctx.H*(p.y+(echo?0.026:0)),align:p.align,track:p.track,
        leading:s*1.65,maxW:ctx.W*p.w,maxH:ctx.H*p.h,maxSize:s,mi:p.mi,rot:p.rot,opacity:echo?0.065:1,plain:!!echo};
    var L=jzText(ctx,p.text.replace(/\n/g,'\r'),o);
    jzTextDoc(L,function(td){td.autoLeading=false;td.leading=td.fontSize*1.65;});jzAnchor(L,p.align);
    jzAnimate(ctx,L,o);
    if(echo){var e=jzEffect(L,'ADBE Gaussian Blur 2','Memory softness');jzEP(e,1,U*0.006);jzNoGhost(L);}
    return L;
}
(function(){
    var ids=['fsrOpenSky','fsrParallelJourney','fsrTwinBalance','fsrLowGround','fsrDriftingMemory'];
    function add(kind){jzReg('layout',kind,{
        plan:function(rng,cut,st){return fsr2_plan(kind,rng,cut,st);},
        build:function(ctx){
            var items=ctx.P.items||[],bb=null,i,L,font=ctx.cut.emph?'gothic_bold':ctx.P.font;
            if(kind==='fsrParallelJourney'){
                fsr2_line(ctx,'Parallel axis A',[[ctx.W*0.13,ctx.H*0.47],[ctx.W*0.76,ctx.H*0.455]],0.19);
                fsr2_line(ctx,'Parallel axis B',[[ctx.W*0.23,ctx.H*0.69],[ctx.W*0.86,ctx.H*0.675]],0.19);
            }
            for(i=0;i<items.length;i++){
                if(items[i].memory)fsr2_text(ctx,items[i],font,true);
                L=fsr2_text(ctx,items[i],font,false);bb=jzUnion(bb,jzBB(L));
            }
            return bb;
        }
    });}
    for(var i=0;i<ids.length;i++)add(ids[i]);
})();
jzReg('bg','fsrSkyWash',{build:function(b){
    var S=bg1_solid(b,b.sc.bg,'Pale sky',b.W,b.H),e=jzEffect(S,'ADBE Ramp','Sky wash');
    jzEP(e,1,[b.W/2,0]);jzEP(e,2,jzHex(jzMixHex(b.sc.bg,b.sc.accent,0.32)));
    jzEP(e,3,[b.W/2,b.H*0.7]);jzEP(e,4,jzHex(b.sc.bg));
}});
// Soft shapes approximate Canvas radial washes; every layer fades and skips ghosts.
function fsr2_haze(ctx,name,x,y,rx,ry,col,alpha,rot) {
    var L=jzEllipseLayer(ctx,name,x,y,rx*1.6,ry*1.4,col,{opacity:alpha*0.65});
    if(rot)jzXf(L,'ADBE Rotate Z').setValue(rot*180/Math.PI);
    var e=jzEffect(L,'ADBE Gaussian Blur 2','Atmospheric softness');jzEP(e,1,Math.max(2,ry*0.75));
    jzFade(ctx,L,0,0.85);jzNoGhost(L);return L;
}
(function(){
    var ids=['fsrRoadLines','fsrHorizonGlow','fsrCloudHaze','fsrWindTrails','fsrTwinShadows','fsrDiffuseBleed'];
    function add(kind){jzReg('decor',kind,{build:function(ctx,bb,d){
        var W=ctx.W,H=ctx.H,sc=ctx.sc,j,L,side,off;
        if(kind==='fsrRoadLines'){
            for(side=-1;side<=1;side+=2)for(off=0;off<2;off++)fsr2_line(ctx,'Paired road',[[W*(0.56+side*0.008),H*0.72],[W*(0.56+side*(0.29+off*0.019)),H*1.04]],0.3);
        }else if(kind==='fsrHorizonGlow'){
            fsr2_haze(ctx,'Horizon glow',W*0.55,H*0.77,W*0.7,H*0.09,sc.accent2,0.27);
            fsr2_haze(ctx,'Horizon light',W*0.55,H*0.75,W*0.56,H*0.033,jzMixHex(sc.bg,'#FFFFFF',0.6),0.55);
        }else if(kind==='fsrCloudHaze'){
            for(j=0;j<3;j++){
                var xs=[0.16,0.49,0.81],ys2=[0.21,0.28,0.18],x=W*xs[j],y=H*ys2[j];
                fsr2_haze(ctx,'Cloud underside',x,y+H*0.04,W*0.18,H*0.046,sc.sub,0.055);
                L=fsr2_haze(ctx,'Soft cloud',x,y,W*(0.18+j%2*0.02),H*(0.07+j%2*0.015),jzMixHex(sc.bg,'#FFFFFF',0.72),0.72);
                jzSetExpr(jzXf(L,'ADBE Position'),jzTH(ctx)+'[value[0]+Math.sin(time*0.24)*'+jzN(W*0.018*ctx.fx.motion)+',value[1]]');
            }
        }else if(kind==='fsrWindTrails'){
            var ys=[0.29,0.32,0.82,0.85];
            for(j=0;j<4;j++){
                var xx=W*(0.05+j*0.18),yy=H*ys[j];
                L=fsr2_line(ctx,'Wind trail',[[xx,yy],[xx+W*0.08,yy-H*0.006],[xx+W*0.19,yy+H*0.004],[xx+W*0.29,yy-H*0.006]],0.2);
                jzSetExpr(jzXf(L,'ADBE Position'),jzTH(ctx)+'[value[0]+Math.sin(time*0.24)*'+jzN(W*0.018*ctx.fx.motion)+',value[1]]');
            }
        }else if(kind==='fsrTwinShadows'){
            for(j=0;j<2;j++){
                L=fsr2_haze(ctx,'Companion shadow '+j,W*(j?0.54:0.46),H*(j?0.6:0.54),W*0.033,H*(j?0.16:0.17),j?sc.accent:sc.sub,j?0.26:0.23,j?0.28:-0.36);
                jzSetExpr(jzXf(L,'ADBE Position'),jzTH(ctx)+'[value[0]+Math.sin(time*0.4)*'+jzN(W*0.008*ctx.fx.motion)+',value[1]]');
            }
        }else if(kind==='fsrDiffuseBleed'){
            for(j=0;j<4;j++){
                L=fsr2_haze(ctx,'Diffuse bleed',W*(0.38+j*0.09),H*(0.57+j%2*0.09),W*0.13,H*0.09,j%2?sc.accent2:sc.accent,0.105);
                jzSetExpr(jzXf(L,'ADBE Scale'),jzTH(ctx)+'var q=cl(time/DUR),s=1+(0.5-0.5*Math.cos(q*Math.PI))*'+jzN(0.15*ctx.fx.motion)+';[value[0]*s,value[1]*s]');
            }
        }
    }});}
    for(var i=0;i<ids.length;i++)add(ids[i]);
})();
jzReg('enter','fsrSoftIn',{apply:function(m){
    m.parts.op.push('f*=0.5-0.5*Math.cos(P*Math.PI);');
    m.parts.pos.push('d[1]+=(0.5+0.5*Math.cos(P*Math.PI))*'+jzN(m.H*0.014)+';');
    var e=jzEffect(m.L,'ADBE Gaussian Blur 2','Soft arrival');jzEX(e,1,m.HD+'(0.5+0.5*Math.cos(P*Math.PI))*'+jzN(10*m.u));
}});
jzReg('exit','fsrSoftOut',{apply:function(m){
    m.parts.op.push('f*=0.5+0.5*Math.cos(PO*Math.PI);');
    var e=jzEffect(m.L,'ADBE Gaussian Blur 2','Soft departure');jzEX(e,1,m.HD+'(0.5-0.5*Math.cos(PO*Math.PI))*'+jzN(14*m.u));
}});
jzReg('hold','fsrTravel',{apply:function(m){m.parts.pos.push('d[0]+='+jzN(m.W*0.018)+'*M*cl(time/DUR)*AMT;');}});
jzReg('hold','fsrRise',{apply:function(m){m.parts.pos.push('d[1]-='+jzN(m.H*0.022)+'*M*cl(time/DUR)*AMT;');}});
jzReg('cam','fsrHorizon',{apply:function(cam){cm_cam(cam,{s:'1+0.035*KM*ios(cu)',y:'-H*0.007*KM*ios(cu)'});}});
