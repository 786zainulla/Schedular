"use client";
import Image from "next/image";
import Script from 'next/script'
import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "searchText": query }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(JSON.stringify(data, null, 2));
      } else {
        setResult(`Error: ${data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleContactClick = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  return (
    <main>



      <div data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease"
        role="banner" className="kutup-nav-component-1 w-nav">
        <div className="kutup-nav-container-1 w-container">
          <div className="kutup-first-element">
            <div className="kutup-horizontal-flex">
              <a href=""
                className="kutup-brand-link-line w-nav-brand">
                <img
                  src="logo.png"
                  loading="lazy"
                  width={100}
                  height={100}
                  alt="Logo"
                />
              </a>
              <div className="kutup-mobile-portrait-hide">
                <div className="kutup-flex-divider">
                  <a data-w-id="7cab4810-f5f8-4a86-2fc4-ee32fea0c864"
                    href=""
                    className="kutup-button-with-line w-inline-block">
                    <div>9902785933</div>
                    <div style={{ width: "0%" }} className="kutup-button-line"></div>
                  </a>
                  <a data-w-id="7cab4810-f5f8-4a86-2fc4-ee32fea0c868"
                    href=""
                    className="kutup-button-with-line w-inline-block">
                    <div>786zainulla@gmail.com</div>
                    <div style={{ width: "0%" }} className="kutup-button-line"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="kutup-last-item">
            <nav role="navigation" className="kutup-nav-menu w-nav-menu">
              <a href="#"
                className="kutup-nav-link w-nav-link"
                style={{ maxWidth: "1200px" }}>Home</a>
              <a href="/task-planner"
                className="kutup-nav-link w-nav-link"
                style={{ maxWidth: "1200px" }}>Schedular</a>
              <a href="tel:9902785933"
                className="kutup-nav-link w-nav-link" style={{ maxWidth: "1200px" }}>Contact</a>
            </nav>
            <div className="kutup-menu-button w-nav-button"
              style={{ WebkitUserSelect: "text" }}
              aria-label="menu"
              role="button"
              tabIndex="0"
              aria-controls="w-nav-overlay-0"
              aria-haspopup="menu"
              aria-expanded="false">
              <img
                src="icon-menu.svg"
                loading="lazy"
                width={30}
                height={30}
                alt="Menu icon"
              />
            </div>
          </div>
        </div>
        <div className="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0"></div>
      </div>
      <div id="w-node-_97522a6c-e779-48e9-b915-8ae25a3d5f9e-7dfae354" className="kutup-cta-3">

        <div id="w-node-_97522a6c-e779-48e9-b915-8ae25a3d5fa0-7dfae354" className="kutup-cta-right-part">
        </div>
        <div id="w-node-_97522a6c-e779-48e9-b915-8ae25a3d5f9f-7dfae354" className="kutup-cta-photo"></div>
      </div>
      <div id="w-node-_37b4dcae-9ccf-c742-095e-bf2f37278b31-7dfae354" className="kutup-footer-1">
        <div className="kutup-medium-container">
          <div className="kutup-footer-flex">


            {showToast && (
              <div className="animate-in slide-in-from-right duration-300">
                <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
                  <span className="font-medium">Contact 9902785933</span>
                  <button
                    onClick={() => setShowToast(false)}
                    className="ml-2 text-white hover:text-gray-200 text-lg"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            <a href="" className="w-inline-block">
              <img
                src="logo.png"
                loading="lazy"
                width={100}
                height={100}
                alt="Logo"
              />
            </a>
            <div className="kutup-footer-horizontal-flex">
              <a href="/" className="kutup-footer-link">Home</a>
              <a href="#" className="kutup-footer-link">About</a>
              <a href="tel:9902785933" className="kutup-footer-link">Contact</a>
            </div>
            <div>
              <div className="kutup-social-wrapper-flex">
                <a href="#" className="kutup-social-link w-inline-block" onClick={handleContactClick}>
                  <img
                    src="twitter.svg"
                    loading="lazy"
                    width={20}
                    height={20}
                    alt="Twitter"
                  />
                </a>
                <a href="#" className="kutup-social-link w-inline-block" onClick={handleContactClick}>
                  <img
                    src="dribbble.svg"
                    loading="lazy"
                    width={20}
                    height={20}
                    alt="Dribbble"
                  />
                </a>
                <a href="#" className="kutup-social-link w-inline-block" onClick={handleContactClick}>
                  <img
                    src="github.svg"
                    loading="lazy"
                    width={20}
                    height={20}
                    alt="GitHub"
                  />
                </a>
                <a href="#" className="kutup-social-link w-inline-block" onClick={handleContactClick}>
                  <img
                    src="instagram.svg"
                    loading="lazy"
                    width={20}
                    height={20}
                    alt="Instagram"
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="kutup-divider-60px"></div>
          <div className="kutup-copyright-center-text">
            <p className="kutup-copyright">© This design is created by Mohammad Zainulla</p>
          </div>
        </div>
      </div>
      <Script src="JS/jquery-3.5.1.min.dc5e7f18c8.js" type="text/javascript"
        integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></Script>
      {/* <Script src="JS/api.js" type="text/javascript"></Script> */}
      {/* <Script src="JS/webflow.e24f6550.e624df2c27677594.js" type="text/javascript"></Script> */}
      <Script src="JS/webflow.schunk.36b8fb49256177c8.js" type="text/javascript"></Script>
      <Script src="JS/webfont.js" type="text/javascript"></Script>
    </main>
  );
}