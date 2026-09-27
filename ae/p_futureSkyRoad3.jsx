// Bounded, phase-offset sway; shares existing per-group timing and motion caps.
jzReg('hold','fsrTwinSway',{apply:function(m){
    m.parts.pos.push('d[0]+='+jzN(m.W*0.005)+'*M*AMT*Math.sin(time*0.65+'+jzN((m.o.mi||0)*0.18)+');');
    m.parts.pos.push('d[1]+='+jzN(m.H*0.003)+'*M*AMT*Math.sin(time*0.52+'+jzN((m.o.mi||0)*0.18)+');');
}});
