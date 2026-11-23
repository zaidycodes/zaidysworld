/** Ashima / Stefan Gustavson 3D simplex noise (public domain / MIT). */
export const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

/* ───────────── liquid chrome blob (World B) ───────────── */
export const blobVert = /* glsl */ `
${NOISE}
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uRadius;
varying vec3 vN;
varying vec3 vV;
varying float vDisp;

vec3 disp(vec3 dir){
  float n = snoise(dir*uFreq + vec3(0.,0.,uTime*.22)) + snoise(dir*uFreq*2.1 - vec3(uTime*.35,0.,0.))*.35;
  return dir * uRadius * (1. + n*uAmp);
}
void main(){
  vec3 dir = normalize(position);
  vec3 p0 = disp(dir);
  vec3 up = abs(dir.y) > .99 ? vec3(1.,0.,0.) : vec3(0.,1.,0.);
  vec3 tg = normalize(cross(dir, up));
  vec3 bt = cross(dir, tg);
  float e = .03;
  vec3 p1 = disp(normalize(dir + tg*e));
  vec3 p2 = disp(normalize(dir + bt*e));
  vec3 nrm = normalize(cross(p1-p0, p2-p0));
  if (dot(nrm, dir) < 0.) nrm = -nrm;
  vDisp = length(p0)/uRadius - 1.;
  vN = normalize(normalMatrix * nrm);
  vec4 mv = modelViewMatrix * vec4(p0, 1.);
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`
export const blobFrag = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uTime;
uniform float uGlow;
varying vec3 vN;
varying vec3 vV;
varying float vDisp;
void main(){
  vec3 n = normalize(vN);
  vec3 v = normalize(vV);
  float ndv = max(dot(n, v), 0.);
  float fres = pow(1. - ndv, 2.4);
  vec3 L = normalize(vec3(.55,.8,.45));
  vec3 H = normalize(L + v);
  float spec = pow(max(dot(n,H),0.), 110.);
  vec3 r = reflect(-v, n);
  float env = smoothstep(-.5, .95, r.y);
  vec3 chrome = mix(vec3(.004,.004,.008), vec3(.46,.5,.64), env*env);
  float band = .5 + .5*sin(r.y*5. + r.x*3. + vDisp*7. + uTime*.25);
  vec3 irid = mix(uColorA, uColorB, band);
  vec3 col = chrome*.62 + irid*fres*(1.1+uGlow) + vec3(spec)*.9 + irid*.025;
  gl_FragColor = vec4(col, 1.);
  #include <colorspace_fragment>
}
`

/* ───────────── particles (stars, dust, eclipse dust) ───────────── */
export const pointsVert = /* glsl */ `
attribute float aSeed;
attribute float aSize;
uniform float uTime;
uniform float uReveal;
uniform float uPx;
uniform float uRepel;
uniform float uAlpha;
uniform float uDrift;
uniform vec3 uMouse;
uniform vec3 uTint;
varying float vA;
varying vec3 vC;
void main(){
  vec3 p = position;
  float t = uTime*(.15 + aSeed*.2);
  p += vec3(sin(t+aSeed*40.), cos(t*1.3+aSeed*20.), sin(t*.7+aSeed*10.)) * uDrift;
  if (uRepel > .5) {
    vec3 d = p - uMouse;
    float l = length(d);
    p += normalize(d + vec3(1e-4)) * smoothstep(2.8, 0., l) * 1.5;
  }
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  float vis = smoothstep(aSeed*.9, aSeed*.9 + .14, uReveal);
  float tw = .68 + .32*sin(uTime*(.6 + aSeed*2.) + aSeed*50.);
  gl_PointSize = aSize * uPx * clamp(60./max(-mv.z, 1.), .5, 3.) * tw;
  vA = vis * tw * uAlpha;
  vec3 base = aSeed < .55 ? vec3(.88,.92,1.) : (aSeed < .82 ? vec3(.55,.68,1.) : vec3(.72,.62,1.));
  vC = base * uTint;
}
`
export const pointsFrag = /* glsl */ `
varying float vA;
varying vec3 vC;
void main(){
  float d = length(gl_PointCoord - .5);
  float a = smoothstep(.5, 0., d);
  a *= a;
  gl_FragColor = vec4(vC, a * vA);
  #include <colorspace_fragment>
}
`

/* ───────────── eclipse ring / disk (World D) ───────────── */
export const ringVert = /* glsl */ `
varying vec2 vP;
void main(){
  vP = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
`
export const ringFrag = /* glsl */ `
${NOISE}
uniform float uTime;
uniform float uInner;
uniform float uPower;
uniform vec3 uHot;
uniform vec3 uCool;
varying vec2 vP;
void main(){
  float r = length(vP);
  float ang = atan(vP.y, vP.x);
  float edge = smoothstep(uInner, uInner + .12, r);
  float fall = exp(-(r - uInner) * .62);
  float core = exp(-pow((r - uInner - .1) * 2.4, 2.));
  float n = snoise(vec3(cos(ang)*2.2, sin(ang)*2.2, r*.55 - uTime*.18));
  float inten = (fall*.55 + core*1.2) * edge * (.72 + .5*n) * uPower;
  vec3 col = mix(uHot, uCool, smoothstep(uInner, uInner + 4.5, r));
  gl_FragColor = vec4(col * inten, inten);
  #include <colorspace_fragment>
}
`

/* ───────────── light slit glow (World C) ───────────── */
export const glowVert = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
`
export const glowFrag = /* glsl */ `
uniform float uAlpha;
varying vec2 vUv;
void main(){
  float x = abs(vUv.x - .5) * 2.;
  float y = abs(vUv.y - .5) * 2.;
  float a = exp(-x*x*7.) * (1. - pow(y, 3.));
  gl_FragColor = vec4(vec3(.72,.8,1.) * a * uAlpha, a * uAlpha);
  #include <colorspace_fragment>
}
`
