import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const WordScrub = ({ id, label, num, text }) => {
  const words = text.trim().split(/\s+/);
  return (
    <div id={id}>
      <div className="ws">
        <span className="wslbl">{label}</span>
        <span className="wsnm">{num}</span>
        <p className="wstext">
          {words.map((w, i) => (
            <React.Fragment key={i}>
              <span className="sw">{w}</span>{' '}
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
};

export default function App() {
  useEffect(() => {
    // Lenis Setup
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    let rafId;
    let mx = 0, my = 0, cx = 0, cy = 0;

    const onScrollPb = () => {
      const pb = document.getElementById('pb');
      if (pb) pb.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
    };

    const onScrollNav = () => {
      document.getElementById('nav')?.classList.toggle('s', window.scrollY > 60);
    };

    window.addEventListener('scroll', onScrollPb, { passive: true });
    window.addEventListener('scroll', onScrollNav, { passive: true });

    const cd = document.getElementById('cd');
    const cr = document.getElementById('cr');
    
    const onMouseMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (cd) { cd.style.left = mx + 'px'; cd.style.top = my + 'px'; }
    };
    document.addEventListener('mousemove', onMouseMove);
    
    const tick = () => {
      cx += (mx - cx) * 0.1; cy += (my - cy) * 0.1;
      if (cr) { cr.style.left = cx + 'px'; cr.style.top = cy + 'px'; }
      rafId = requestAnimationFrame(tick);
    };
    tick();

    const addCh = () => document.body.classList.add('ch');
    const removeCh = () => document.body.classList.remove('ch');
    const hoverElements = document.querySelectorAll('a,button,.hpc,.wcard,.delz,.rwc,.pm,.sc');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', addCh);
      el.addEventListener('mouseleave', removeCh);
    });

    const mb = document.getElementById('magBtn');
    const onMbMove = e => {
      const r = mb.getBoundingClientRect();
      gsap.to(mb, { x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.28, duration: .3, ease: 'power2.out' });
    };
    const onMbLeave = () => gsap.to(mb, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1.2,.4)' });
    
    if (mb) {
      mb.addEventListener('mousemove', onMbMove);
      mb.addEventListener('mouseleave', onMbLeave);
    }

    const ctx = gsap.context(() => {
      // Hero Timeline
      const heroTl = gsap.timeline({ delay: 0.1 });
      heroTl
        .to('.hli', { y: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out' })
        .to('.h眉',  { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, .25)
        .to('.hdesc',{ opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, .45)
        .to('.hscr', { opacity: 1, duration: .5 }, .65)
        .to(['.nL', '.nR'], { opacity: 1, duration: .5 }, .2);

      gsap.to('.htitle', { y: -110, opacity: 0, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.4 } });
      gsap.to('.hdesc',  { y: -55,            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.9 } });
      gsap.to('.hgrid',  { y: -40,            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });

      // Word Scrub
      const buildScrub = (wrapperId, scrollDist) => {
        const wrapper = document.getElementById(wrapperId);
        if (!wrapper) return;
        const spans = wrapper.querySelectorAll('.sw');
        if (spans.length === 0) return;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#' + wrapperId,
            start: 'top top',
            end: '+=' + scrollDist + '%',
            pin: true,
            scrub: 1.6,
          }
        });
        spans.forEach((s, i) => tl.to(s, { color: '#F0EDE6', duration: .4 }, i / spans.length * (scrollDist * .04)));
      };
      buildScrub('ws1', 260);

      // Stats
      document.querySelectorAll('.snum[data-t]').forEach(el => {
        const target = parseFloat(el.dataset.t);
        const sfx = el.dataset.sfx || '';
        ScrollTrigger.create({
          trigger: el, start: 'top 85%', once: true,
          onEnter() {
            el.closest('.sst')?.classList.add('in');
            if (target < 100) {
              el.textContent = target + sfx; return;
            }
            gsap.to({ v: 0 }, {
              v: target, duration: 2.2, ease: 'power3.out',
              onUpdate() { el.textContent = Math.round(this.targets()[0].v).toLocaleString() + sfx; }
            });
          }
        });
      });

      // Story
      gsap.from('.stGhost', { x: -70, opacity: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '.story', start: 'top 70%' } });
      gsap.from('.stR > *',  { y: 30,  opacity: 0, duration: .9, stagger: .13, ease: 'power3.out', scrollTrigger: { trigger: '.stR', start: 'top 75%' } });
      gsap.from('.stTag',    { x: -30, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.stL', start: 'top 75%' } });

      // Why Choose
      const wcards = document.querySelectorAll('.wcard');
      ScrollTrigger.create({
        trigger: '#why',
        start: 'top top',
        end: '+=380%',
        pin: true,
        anticipatePin: 1,
        onUpdate(self) {
          const p = self.progress;
          wcards.forEach((c, i) => {
            const s = i * 0.21, e = s + 0.19;
            const cp = Math.max(0, Math.min(1, (p - s) / (e - s)));
            c.style.opacity = cp;
            c.style.transform = `translateY(${28 * (1 - cp)}px)`;
            if (cp > .52 && !c.classList.contains('lit')) c.classList.add('lit');
          });
        }
      });

      // Horizontal Scroll
      const hstrk = document.getElementById('hstrk');
      const hdots = document.querySelectorAll('.hdot');
      const hcards = gsap.utils.toArray('.hpc');
      if (hstrk && hcards.length > 0) {
        gsap.to(hstrk, {
          x: () => -(hstrk.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: '#hs',
            pin: true,
            scrub: 1.2,
            invalidateOnRefresh: true,
            end: () => '+=' + (hstrk.scrollWidth - window.innerWidth),
            onUpdate(self) {
              const idx = Math.round(self.progress * (hcards.length - 1));
              hdots.forEach((d, i) => d.classList.toggle('a', i === idx));
            }
          }
        });
      }

      // Refurb
      gsap.from(['.rftitle', '.rfdesc', '.rfbadge'], { y: 36, opacity: 0, duration: 1, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: '.rfhd', start: 'top 78%' } });
      gsap.to('.pfill', {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '.proc', start: 'top 65%', end: 'bottom 55%', scrub: 1 }
      });
      gsap.to('.pstep', {
        opacity: 1, y: 0, duration: .65, stagger: .15, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.proc', start: 'top 65%',
          onEnter() {
            document.querySelectorAll('.pstep').forEach((s, i) =>
              setTimeout(() => s.classList.add('lit'), i * 200)
            );
          }
        }
      });

      // Delivery
      gsap.from(['.deltitle', '.delsub'], { y: 36, opacity: 0, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.delhd', start: 'top 80%' } });
      gsap.to('.delz', {
        opacity: 1, x: 0, duration: .7, stagger: .18, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.delzones', start: 'top 78%',
          onEnter() { document.querySelectorAll('.delz').forEach(z => z.classList.add('in')); }
        }
      });
      gsap.to('.delx', { opacity: 1, x: 0, duration: .7, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: '.delxtras', start: 'top 78%' } });

      buildScrub('ws2', 250);

      // Returns / Warranty
      gsap.to('.rwc', {
        opacity: 1, y: 0, duration: .9, stagger: .2, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.rw', start: 'top 80%',
          onEnter() { document.querySelectorAll('.rwc').forEach(c => c.classList.add('in')); }
        }
      });

      // Payment & Support
      gsap.from(['.paytit'], { y: 30, opacity: 0, duration: 1, stagger: .2, ease: 'power3.out', scrollTrigger: { trigger: '.pay', start: 'top 80%' } });
      gsap.to('.pm',  { opacity: 1, y: 0, duration: .6, stagger: .1,  ease: 'power3.out', scrollTrigger: { trigger: '.pmethods',  start: 'top 80%' } });
      gsap.to('.pfin',{ opacity: 1, y: 0, duration: .6,               ease: 'power3.out', scrollTrigger: { trigger: '.pfin',      start: 'top 88%' } });
      gsap.to('.sc',  { opacity: 1, x: 0, duration: .6, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.supch',     start: 'top 80%' } });

      // CTA
      const ctaTl = gsap.timeline({ scrollTrigger: { trigger: '.cta', start: 'top 78%' } });
      ctaTl
        .to('.ctatag', { opacity: 1, y: 0, duration: .6 })
        .to('.ctatit', { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=.3')
        .to('.magbtn', { opacity: 1, scale: 1, duration: .9, ease: 'back.out(1.8)' }, '-=.5')
        .to('.ctaloc', { opacity: 1, duration: .5 }, '-=.2');
      gsap.from('.ctaghost', { scale: .75, opacity: 0, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: '.cta', start: 'top 80%' } });

      // Section Labels
      gsap.utils.toArray('.slabel').forEach(el => {
        gsap.from(el, { opacity: 0, x: -14, duration: .5, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
      });

      // Ensure ScrollTriggers are processed in DOM order
      ScrollTrigger.sort();
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    });

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      cancelAnimationFrame(rafId);
      document.body.classList.remove('ch');
      window.removeEventListener('scroll', onScrollPb);
      window.removeEventListener('scroll', onScrollNav);
      document.removeEventListener('mousemove', onMouseMove);
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', addCh);
        el.removeEventListener('mouseleave', removeCh);
      });
      if (mb) {
        mb.removeEventListener('mousemove', onMbMove);
        mb.removeEventListener('mouseleave', onMbLeave);
      }
    };
  }, []);

  return (
    <>
      <div id="cd"></div>
      <div id="cr"></div>

      <div id="pb"></div>

      <nav id="nav">
        <a href="#" className="nL">NI DRIP <em>CENTRAL</em></a>
        <div className="nR">
          <a href="#" className="nLk">Our Story</a>
          <a href="#" className="nLk">Products</a>
          <a href="#" className="nLk">Refurbished</a>
          <a href="#" className="nCta">Shop Now</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hgrid"></div>
        <div className="hvig"></div>
        <div className="h眉">
          <span className="hbadge"><span className="hbdot"></span> Belfast · Est. 2025</span>
          <span className="hdiv"></span>
          <span className="hest">Electronics &amp; Appliances</span>
        </div>
        <h1 className="htitle">
          <span className="hln"><span className="hli">NI DRIP</span></span>
          <span className="hln"><span className="hli">CENTRAL</span></span>
          <span className="hln"><span className="hli bl">ELECTRONICS</span></span>
        </h1>
        <div className="hfoot">
          <p className="hdesc">Belfast's trusted local source for affordable, reliable home &amp; entertainment appliances — new and carefully refurbished.</p>
          <div className="hscr">
            <div className="hscrLn"></div>
            <span className="hscrL">Scroll</span>
          </div>
        </div>
      </section>

      <div className="tkr">
        <div className="trow">
          <div className="ttrk">
            <span className="titem">NI Drip Central <span className="tdot">●</span></span>
            <span className="titem">Belfast <span className="tdot">●</span></span>
            <span className="titem">Fast Local Delivery <span className="tdot">●</span></span>
            <span className="titem">New &amp; Refurbished <span className="tdot">●</span></span>
            <span className="titem">Trusted by Locals <span className="tdot">●</span></span>
            <span className="titem">Founded 2025 <span className="tdot">●</span></span>
            <span className="titem">Big Brand Prices <span className="tdot">●</span></span>
            <span className="titem">NI Drip Central <span className="tdot">●</span></span>
            <span className="titem">Belfast <span className="tdot">●</span></span>
            <span className="titem">Fast Local Delivery <span className="tdot">●</span></span>
            <span className="titem">New &amp; Refurbished <span className="tdot">●</span></span>
            <span className="titem">Trusted by Locals <span className="tdot">●</span></span>
            <span className="titem">Founded 2025 <span className="tdot">●</span></span>
            <span className="titem">Big Brand Prices <span className="tdot">●</span></span>
          </div>
        </div>
        <div className="trow">
          <div className="ttrk rev">
            <span className="titem">Electronics <span className="tdot">●</span></span>
            <span className="titem">Kitchen Appliances <span className="tdot">●</span></span>
            <span className="titem">Televisions <span className="tdot">●</span></span>
            <span className="titem">Shawn Atkinson <span className="tdot">●</span></span>
            <span className="titem">After-Sales Support <span className="tdot">●</span></span>
            <span className="titem">Honest Pricing <span className="tdot">●</span></span>
            <span className="titem">Northern Ireland <span className="tdot">●</span></span>
            <span className="titem">Electronics <span className="tdot">●</span></span>
            <span className="titem">Kitchen Appliances <span className="tdot">●</span></span>
            <span className="titem">Televisions <span className="tdot">●</span></span>
            <span className="titem">Shawn Atkinson <span className="tdot">●</span></span>
            <span className="titem">After-Sales Support <span className="tdot">●</span></span>
            <span className="titem">Honest Pricing <span className="tdot">●</span></span>
            <span className="titem">Northern Ireland <span className="tdot">●</span></span>
          </div>
        </div>
      </div>

      <WordScrub 
        id="ws1" 
        label="Our Reason" 
        num="01 / 02" 
        text="Belfast's trusted local source for affordable, reliable appliances — both new and refurbished. We exist to make quality accessible to every home in Northern Ireland." 
      />

      <div className="stats">
        <div className="sst">
          <div className="sstbar"></div>
          <span className="snum" data-t="500" data-sfx="+">0+</span>
          <span className="slbl">Homes Served</span>
          <span className="ssub">and growing</span>
        </div>
        <div className="sst">
          <div className="sstbar"></div>
          <span className="snum" data-t="2025" data-sfx="">2025</span>
          <span className="slbl">Year Founded</span>
          <span className="ssub">Belfast-born</span>
        </div>
        <div className="sst">
          <div className="sstbar"></div>
          <span className="snum" data-t="6" data-sfx=" Mo">6 Mo</span>
          <span className="slbl">Min. Warranty</span>
          <span className="ssub">on all refurbished</span>
        </div>
        <div className="sst">
          <div className="sstbar"></div>
          <span className="snum" data-t="14" data-sfx=" Day">14 Day</span>
          <span className="slbl">Returns Policy</span>
          <span className="ssub">no questions asked</span>
        </div>
      </div>

      <section className="story">
        <div className="stIn">
          <div className="stL">
            <div className="stGhost">2025</div>
            <div className="stTag">Belfast's Own</div>
          </div>
          <div className="stR">
            <span className="slabel">Our Story</span>
            <h2>Built on Trust,<br/>Powered by <em>Community</em></h2>
            <p className="stbody">Founded by Shawn Atkinson, NI DRIP CENTRAL started with one clear mission — give Belfast families access to quality appliances at prices that actually make sense.</p>
            <p className="stbody">We grew by doing things right. Every customer served. Every appliance delivered. Every refurbished unit inspected, cleaned, and double-checked. Belfast trusted us, and we take that responsibility seriously.</p>
            <div className="fc">
              <div className="fav">SA</div>
              <div>
                <span className="frole">Founder &amp; Director</span>
                <span className="fname">Shawn Atkinson</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="why">
        <div className="why-hd">
          <span className="slabel">Why Choose Us</span>
          <h2 className="why-t">Four Reasons <em>Belfast</em><br/>Chooses Us</h2>
        </div>
        <div className="wgrid">
          <div className="wcard">
            <div className="wbar"></div>
            <div className="wnum">01</div>
            <span className="wico">⚡</span>
            <h3>Fast Local Delivery</h3>
            <p>Belfast-based means fast. We know the streets and we get your appliances to you quickly — no waiting around, no national courier delays.</p>
          </div>
          <div className="wcard">
            <div className="wbar"></div>
            <div className="wnum">02</div>
            <span className="wico">£</span>
            <h3>Affordable Big Brands</h3>
            <p>Premium brands at honest prices. Quality appliances should be within reach for every Belfast household — not just those with premium budgets.</p>
          </div>
          <div className="wcard">
            <div className="wbar"></div>
            <div className="wnum">03</div>
            <span className="wico">♡</span>
            <h3>Friendly Service</h3>
            <p>No jargon, no pressure. Just honest advice from people who genuinely care about finding you the right appliance for your home and budget.</p>
          </div>
          <div className="wcard">
            <div className="wbar"></div>
            <div className="wnum">04</div>
            <span className="wico">●</span>
            <h3>Belfast Trusted</h3>
            <p>Local, accountable, and here for the long term. Your trust is the foundation everything we do is built on — and we intend to keep it.</p>
          </div>
        </div>
      </div>

      <div id="hs">
        <div id="hshead">
          <span className="slabel">What We Sell</span>
          <h2>Home &amp; <em>Entertainment</em></h2>
        </div>
        <div id="hstrk">
          <div className="hpc">
            <div className="hpnum">01</div>
            <span className="hpemj">📺</span>
            <span className="hbg bb">New &amp; Refurbished</span>
            <h3>Televisions</h3>
            <p>Smart TVs, 4K, OLED — all major brands at prices that make sense for Belfast homes. From compact to cinema-sized.</p>
            <div className="hpline"></div>
          </div>
          <div className="hpc">
            <div className="hpnum">02</div>
            <span className="hpemj">🧺</span>
            <span className="hbg br">Refurbished Available</span>
            <h3>Washing Machines</h3>
            <p>Reliable laundry solutions for every household size and budget. Freestanding and integrated, all thoroughly tested.</p>
            <div className="hpline"></div>
          </div>
          <div className="hpc">
            <div className="hpnum">03</div>
            <span className="hpemj">🧊</span>
            <span className="hbg bb">New &amp; Refurbished</span>
            <h3>Fridges &amp; Freezers</h3>
            <p>American-style, freestanding, integrated — keep it fresh without the premium price tag. Wide range of sizes and styles.</p>
            <div className="hpline"></div>
          </div>
          <div className="hpc">
            <div className="hpnum">04</div>
            <span className="hpemj">🎮</span>
            <span className="hbg bn">New In</span>
            <h3>Gaming &amp; Audio</h3>
            <p>Home entertainment systems, sound bars, and hi-fi speakers. Bring the full cinematic experience into your living room.</p>
            <div className="hpline"></div>
          </div>
          <div className="hpc">
            <div className="hpnum">05</div>
            <span className="hpemj">🍽️</span>
            <span className="hbg br">Refurbished Available</span>
            <h3>Dishwashers</h3>
            <p>Save time, save water. Freestanding and integrated models from trusted brands. Built-in and slimline options available.</p>
            <div className="hpline"></div>
          </div>
          <div className="hpc">
            <div className="hpnum">06</div>
            <span className="hpemj">🌬️</span>
            <span className="hbg bn">New In</span>
            <h3>Small Appliances</h3>
            <p>Microwaves, vacuum cleaners, air fryers and more. Everything you need for every corner of your home, at honest prices.</p>
            <div className="hpline"></div>
          </div>
        </div>
        <div id="hdots">
          <div className="hdot a"></div>
          <div className="hdot"></div>
          <div className="hdot"></div>
          <div className="hdot"></div>
          <div className="hdot"></div>
          <div className="hdot"></div>
        </div>
      </div>

      <section className="refurb">
        <div className="rfhd">
          <div>
            <span className="slabel">Refurbished Promise</span>
            <h2 className="rftitle">Our <em>Refurbishment</em><br/>Process</h2>
          </div>
          <div>
            <p className="rfdesc">Every refurbished appliance at NI DRIP CENTRAL goes through a rigorous, multi-stage process before it ever reaches a customer. We don't cut corners — your confidence matters more than our convenience.</p>
            <span className="rfbadge">✓ Minimum 6-Month Warranty on All Refurbished Items</span>
          </div>
        </div>
        <div className="proc">
          <div className="pline"><div className="pfill" id="pfill"></div></div>
          <div className="psteps">
            <div className="pstep" data-step="0">
              <div className="pdot">🔍</div>
              <span className="plbl">Inspection</span>
              <span className="psub">Full structural &amp; electrical assessment</span>
            </div>
            <div className="pstep" data-step="1">
              <div className="pdot">🧹</div>
              <span className="plbl">Deep Clean</span>
              <span className="psub">Professional cleaning inside &amp; out</span>
            </div>
            <div className="pstep" data-step="2">
              <div className="pdot">⚙️</div>
              <span className="plbl">Repair</span>
              <span className="psub">Parts replaced to full working order</span>
            </div>
            <div className="pstep" data-step="3">
              <div className="pdot">✅</div>
              <span className="plbl">Rigorous Testing</span>
              <span className="psub">All functions tested to pass our standards</span>
            </div>
            <div className="pstep" data-step="4">
              <div className="pdot">🏷️</div>
              <span className="plbl">Grade &amp; Sell</span>
              <span className="psub">Cosmetically graded, defects disclosed</span>
            </div>
          </div>
        </div>
      </section>

      <section className="del">
        <div className="delhd">
          <span className="slabel">Delivery</span>
          <h2 className="deltitle">We Deliver Across<br/><em>Northern Ireland</em></h2>
          <p className="delsub">And beyond — Republic of Ireland and mainland UK available on request.</p>
        </div>
        <div className="delgrid">
          <div className="delzones">
            <div className="delz">
              <div className="dbar"></div>
              <span className="dzname">Belfast &amp; Local Areas</span>
              <div className="dztime"><strong>1–3</strong><span>Working Days</span></div>
            </div>
            <div className="delz">
              <div className="dbar"></div>
              <span className="dzname">Greater Northern Ireland</span>
              <div className="dztime"><strong>3–5</strong><span>Working Days</span></div>
            </div>
            <div className="delz">
              <div className="dbar"></div>
              <span className="dzname">Republic of Ireland &amp; UK</span>
              <div className="dztime"><strong>5–7</strong><span>Working Days</span></div>
            </div>
          </div>
          <div className="delxtras">
            <div className="delx">
              <span className="dxlbl">Express</span>
              <div className="dxtitle">Next-Day Delivery</div>
              <p>Available for in-stock items ordered before 2pm. Contact us to arrange.</p>
            </div>
            <div className="delx">
              <span className="dxlbl">Collect</span>
              <div className="dxtitle">Free In-Store Collection</div>
              <p>Visit us in Belfast during business hours. Free of charge, available for all orders.</p>
            </div>
            <div className="delx">
              <span className="dxlbl">Large Appliances</span>
              <div className="dxtitle">Installation Included</div>
              <p>Delivery of large appliances includes installation where applicable at no extra cost.</p>
            </div>
          </div>
        </div>
      </section>

      <WordScrub 
        id="ws2" 
        label="Our Commitment" 
        num="02 / 02" 
        text="Our commitment goes beyond simply selling appliances. We're building long-term trust — with clear pricing, honest product descriptions, and reliable after-sales support that genuinely makes everyday life easier." 
      />

      <div className="rw">
        <div className="rwc">
          <div className="rwbar"></div>
          <span className="rwlbl">Returns Policy</span>
          <span className="rwbig">14</span>
          <p className="rwdesc">Day returns on most products from the date of delivery. Item must be unused, in original condition and packaging. Faulty items collected free of charge. Refund processed within 5–7 working days to your original payment method.</p>
        </div>
        <div className="rwc">
          <div className="rwbar"></div>
          <span className="rwlbl">Refurbished Warranty</span>
          <span className="rwbig">6+</span>
          <p className="rwdesc">Month minimum warranty on every refurbished item we sell. New products carry the full manufacturer's warranty — typically 1 to 2 years. Extended warranties available on selected products for total peace of mind.</p>
        </div>
      </div>

      <section className="pay">
        <div className="payIn">
          <div>
            <span className="slabel">Payment Options</span>
            <h2 className="paytit">Pay Your<br/><em>Way</em></h2>
            <div className="pmethods">
              <div className="pm">
                <span className="pmico">💳</span>
                <span className="pmname">Cards</span>
                <span className="pmdesc">Visa, Mastercard &amp; Amex accepted online and in store</span>
              </div>
              <div className="pm">
                <span className="pmico">🏦</span>
                <span className="pmname">Bank Transfer</span>
                <span className="pmdesc">Available for larger purchases. Contact us for details</span>
              </div>
              <div className="pm">
                <span className="pmico">💵</span>
                <span className="pmname">Cash</span>
                <span className="pmdesc">Accepted for in-store purchases and local collection orders</span>
              </div>
              <div className="pm">
                <span className="pmico">📋</span>
                <span className="pmname">Finance</span>
                <span className="pmdesc">Interest-free &amp; low-rate options on qualifying orders</span>
              </div>
            </div>
            <div className="pfin">
              <span style={{ fontSize: '22px' }}>✨</span>
              <p><strong>Interest-free finance available</strong> on qualifying orders. Spread the cost of big appliances without the stress.</p>
            </div>
          </div>
          <div>
            <span className="slabel">Customer Support</span>
            <h2 className="paytit">We're<br/><em>Here</em> For You</h2>
            <div className="supch">
              <div className="sc">
                <div className="scdot"></div>
                <span className="scname">Phone</span>
                <span className="scdet">Immediate assistance during business hours</span>
              </div>
              <div className="sc">
                <div className="scdot"></div>
                <span className="scname">Email</span>
                <span className="scdet">We respond within 24 hours</span>
              </div>
              <div className="sc">
                <div className="scdot"></div>
                <span className="scname">In-Store</span>
                <span className="scdet">Face-to-face support in Belfast</span>
              </div>
              <div className="sc">
                <div className="scdot"></div>
                <span className="scname">Social Media</span>
                <span className="scdet">Reach us across our social channels</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="ctaghost">BELFAST</div>
        <span className="ctatag">Serving Belfast Since 2025</span>
        <h2 className="ctatit">Ready to <em>Upgrade</em><br/>Your Home?</h2>
        <a href="#" className="magbtn" id="magBtn">SHOP THE STORE &nbsp;→</a>
        <span className="ctaloc">● Belfast, Northern Ireland &nbsp;·&nbsp; Local Delivery Available &nbsp;·&nbsp; New &amp; Refurbished</span>
      </section>

      <footer className="footer">
        <span className="flogo">NI Drip <em>Central</em></span>
        <div className="flinks">
          <a href="#" className="flnk">Products</a>
          <a href="#" className="flnk">Refurbished</a>
          <a href="#" className="flnk">Delivery</a>
          <a href="#" className="flnk">Contact</a>
        </div>
        <span className="fcopy">© 2025 NI Drip Central Electronics &amp; Appliances · Belfast, NI</span>
      </footer>
    </>
  );
}
