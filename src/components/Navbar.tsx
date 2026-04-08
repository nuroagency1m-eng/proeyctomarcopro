'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NotificationBell from './NotificationBell'

const navItems = [
  { href: '/dashboard', iconClass: 'fa-solid fa-house', label: 'Inicio' },
  { href: '/dashboard/services/ads', iconClass: 'fa-solid fa-bullhorn', label: 'Ads' },
  { href: '/dashboard/services/whatsapp', iconClass: 'fa-brands fa-whatsapp', label: 'WhatsApp' },
  { href: '/dashboard/services/social', iconClass: 'fa-solid fa-share-nodes', label: 'Social' },
  { href: '/dashboard/services/sales', iconClass: 'fa-solid fa-chart-line', label: 'Sales' },
  { href: '/dashboard/services/landing-pages', iconClass: 'fa-solid fa-file', label: 'Landing' },
  { href: '/dashboard/services/virtual-store', iconClass: 'fa-solid fa-shop', label: 'Tienda' },
  { href: '/dashboard/services/marketplace', iconClass: 'fa-solid fa-cube', label: 'Market' },
  { href: '/dashboard/services/clipping', iconClass: 'fa-solid fa-newspaper', label: 'Clipping' },
  { href: '/dashboard/courses', iconClass: 'fa-solid fa-book-open', label: 'Academy' },
  { href: '/dashboard/wallet', iconClass: 'fa-solid fa-wallet', label: 'Wallet' },
  { href: '/dashboard/store', iconClass: 'fa-solid fa-bag-shopping', label: 'Shop' },
]

const mobileNavItems = [
  { href: '/dashboard', iconClass: 'fa-solid fa-house', label: 'Inicio' },
  { href: '/dashboard/services', iconClass: 'fa-solid fa-th-large', label: 'Servicios' },
  { href: '/dashboard/courses', iconClass: 'fa-solid fa-book-open', label: 'Academy' },
  { href: '/dashboard/store', iconClass: 'fa-solid fa-bag-shopping', label: 'Shop' },
  { href: '/dashboard/wallet', iconClass: 'fa-solid fa-wallet', label: 'Wallet' },
]

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' })
  window.location.href = '/login'
}

export default function Navbar() {
  const pathname = usePathname()

  return (
    <>
      {/* ── SIDEBAR DESKTOP ── */}
      <aside className="sidebar hidden lg:flex" aria-label="Barra lateral">
        <Link href="/dashboard" className="sidebar__logo">
          <div className="sidebar__logo-ring">
            <img src="/logo.png" alt="MY DIAMOND" />
          </div>
          <div className="sidebar__logo-info">
            <span className="sidebar__logo-jd">MY</span>
            <span className="sidebar__logo-intl">DIAMOND</span>
            <span className="sidebar__logo-badge"><span className="u-live-dot"></span>&nbsp;Premium</span>
          </div>
        </Link>

        <nav className="sidebar__nav" aria-label="Menú">
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'nav-item--active' : ''}`}
              >
                <span className="nav-item__icon"><i className={item.iconClass}></i></span>
                <span className="nav-item__label">{item.label}</span>
                <span className="nav-item__dot"></span>
              </Link>
            )
          })}
          <div className="sidebar__nav-sep"></div>
          <Link href="/dashboard/settings" className={`nav-item ${pathname === '/dashboard/settings' ? 'nav-item--active' : ''}`}>
            <span className="nav-item__icon"><i className="fa-solid fa-gear"></i></span>
            <span className="nav-item__label">Configuración</span>
            <span className="nav-item__dot"></span>
          </Link>
          <button onClick={logout} className="nav-item" style={{ width:'100%', background:'none', border:'none', cursor:'pointer', color:'rgba(255,100,100,0.8)' }}>
            <span className="nav-item__icon"><i className="fa-solid fa-right-from-bracket"></i></span>
            <span className="nav-item__label">Salir</span>
          </button>
        </nav>

        <div className="sidebar__user">
          <NotificationBell />
          <div className="sidebar__user-av" id="dAvatar"><i className="fa-solid fa-user"></i></div>
          <div>
            <p className="sidebar__user-name">Usuario</p>
            <p className="sidebar__user-role">@user · <span style={{ color: 'var(--clr-accent-lt)' }}>Activo</span></p>
          </div>
        </div>
      </aside>

      {/* ── TOPBAR MÓVIL ── */}
      <div className="lg:hidden" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'rgba(7, 16, 46, 0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(210, 3, 221, 0.12)',
      }}>
        <Link href="/dashboard/settings" style={{
          width: 36, height: 36, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: pathname === '/dashboard/settings' ? 'rgba(210,3,221,0.18)' : 'rgba(255,255,255,0.06)',
          color: pathname === '/dashboard/settings' ? '#e855f0' : 'rgba(255,255,255,0.5)',
          fontSize: '0.95rem', textDecoration: 'none',
        }}>
          <i className="fa-solid fa-gear"></i>
        </Link>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/logo.png" alt="MY DIAMOND" style={{ width: 28, height: 28, borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>MY DIAMOND</span>
        </Link>
        <button onClick={logout} style={{
          width: 36, height: 36, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,80,80,0.08)',
          color: 'rgba(255,100,100,0.8)',
          fontSize: '0.95rem', border: 'none', cursor: 'pointer',
        }}>
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>

      {/* ── BARRA MÓVIL ── */}
      <nav className="bottom-nav lg:hidden" aria-label="Navegación principal">
        {mobileNavItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bnav__item ${isActive ? 'bnav__item--active' : ''}`}
            >
              <i className={item.iconClass}></i>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}

