import { Link } from 'react-router-dom';
import Garland from '../components/Garland';

const PILLARS = [
  {
    title: 'Party Halls & Rooms',
    desc: 'Air-conditioned halls and open-garden venues for marriages, birthdays, and receptions — browse capacity, address, and availability calendar.',
    img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80',
  },
  {
    title: 'Flower Decoration',
    desc: 'Stage backdrops, entrance arches, and table centerpieces styled fresh for every occasion.',
    img: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=80',
  },
  {
    title: 'Catering & Food Court',
    desc: 'Multi-cuisine catering and live food-court stalls, priced per plate or as a package.',
    img: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80',
  },
  {
    title: 'DJ & Sound',
    desc: 'Professional DJ, sound, and lighting to carry the whole event from welcome to send-off.',
    img: 'https://images.unsplash.com/photo-1571266028243-d220c9d0c22e?w=600&q=80',
  },
  {
    title: 'Invitation Cards & Posters',
    desc: 'Custom-designed invitation cards and event posters, designed and printed end-to-end.',
    img: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&q=80',
  },
  {
    title: 'End-to-End Management',
    desc: 'One dashboard to track every booking, payment, and vendor — Flovera runs the A to Z of your event.',
    img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
  },
];

const STEPS = [
  { n: '01', title: 'Browse & choose', desc: 'Explore halls, décor, catering, DJ, and print services with live pricing and availability.' },
  { n: '02', title: 'Book your date', desc: 'Pick your event date on the calendar — Flovera blocks the slot the moment you confirm.' },
  { n: '03', title: 'Track in your dashboard', desc: 'Follow booking status and payment progress from one customer dashboard.' },
  { n: '04', title: 'We run the day', desc: 'Our team handles setup, vendors, and coordination — you just show up and celebrate.' },
];

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div>
            <span className="eyebrow">Every event, one team</span>
            <h1>Flovera plans it, decorates it, feeds it, and runs it — start to finish.</h1>
            <p>
              From the hall booking to the last song the DJ plays, Flovera manages the complete A–Z of
              your marriage, birthday, or celebration: venues, flower decoration, catering, food courts,
              invitation cards, event posters, and on-ground coordination.
            </p>
            <div className="hero-cta">
              <Link to="/services" className="btn btn-gold">Explore services</Link>
              <Link to="/register" className="btn btn-outline" style={{ borderColor: 'rgba(252,250,244,0.5)', color: '#FCFAF4' }}>
                Create an account
              </Link>
            </div>
            <div className="hero-stats">
              <div><strong>120+</strong><span>Events managed</span></div>
              <div><strong>18</strong><span>Partner venues</span></div>
              <div><strong>4.8/5</strong><span>Customer rating</span></div>
            </div>
          </div>
          <div className="hero-card">
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=80" alt="Decorated wedding stage with flowers" />
            <h3 style={{ marginBottom: 6 }}>Grand Celebration Hall</h3>
            <p style={{ marginBottom: 10 }}>500 guest capacity · Chennai</p>
            <div className="price">₹75,000 <span>/ event</span></div>
          </div>
        </div>
      </section>

      <Garland />

      <section className="block">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What we cover</span>
            <h2>Everything an event needs, under one roof</h2>
            <p>Every service below is bookable directly through Flovera — pricing, calendar, and address included.</p>
          </div>
          <div className="grid-3">
            {PILLARS.map((p) => (
              <div className="card" key={p.title}>
                <img src={p.img} alt="" className="service-image" />
                <div className="card-body">
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Garland flip />

      <section className="block" style={{ background: 'var(--sage-ivory-deep)' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>Booking with Flovera, in four steps</h2>
          </div>
          <div className="grid-2">
            {STEPS.map((s) => (
              <div className="card" key={s.n}>
                <div className="card-body">
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)' }}>{s.n}</span>
                    <div>
                      <h3>{s.title}</h3>
                      <p style={{ marginBottom: 0 }}>{s.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready to plan your event?</h2>
          <p style={{ maxWidth: 520, margin: '0 auto 24px auto' }}>
            Check live pricing, availability, and addresses for every hall and service on the Services page.
          </p>
          <Link to="/services" className="btn btn-primary">View all services</Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="brand" style={{ justifyContent: 'center', color: '#FCFAF4', marginBottom: 8 }}>
            <span className="mark">✿</span> Flovera
          </div>
          Full-service event management — halls, décor, catering, DJ, and print, managed end to end.
        </div>
      </footer>
    </div>
  );
}
