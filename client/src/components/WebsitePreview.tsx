import React from 'react';

interface SeoPageContent {
  title: string;
  metaDescription: string;
  headings: {
    tag: string; // h1, h2, h3, etc.
    content: string;
  }[];
  body: string;
  images: {
    src: string;
    alt: string;
  }[];
  links: {
    href: string;
    text: string;
    isInternal: boolean;
  }[];
  schemaMarkup?: string; // Optional JSON-LD schema markup
}

interface WebsitePreviewProps {
  content: SeoPageContent;
  industry: string;
  difficulty: string;
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ content, industry, difficulty }) => {
  // Determine site template based on industry
  const getTemplate = () => {
    switch (industry.toLowerCase()) {
      case 'healthcare':
        return {
          primaryColor: '#4285F4',
          secondaryColor: '#34A853',
          fontFamily: 'Roboto, sans-serif',
          logo: 'Bright Smile Family Dentistry',
          menu: ['Home', 'Services', 'About', 'Testimonials', 'Contact'],
          theme: 'health-theme'
        };
      case 'e-commerce':
        return {
          primaryColor: '#FF9900',
          secondaryColor: '#146EB4',
          fontFamily: 'Montserrat, sans-serif',
          logo: 'Organic Coffee Co.',
          menu: ['Home', 'Shop', 'About', 'Blog', 'Contact'],
          theme: 'shop-theme'
        };
      case 'real estate':
        return {
          primaryColor: '#C41E3A',
          secondaryColor: '#1A365D',
          fontFamily: 'Lato, sans-serif',
          logo: 'Premier Properties',
          menu: ['Home', 'Properties', 'Agents', 'Sell', 'Contact'],
          theme: 'realty-theme'
        };
      default:
        return {
          primaryColor: '#333333',
          secondaryColor: '#666666',
          fontFamily: 'Arial, sans-serif',
          logo: 'Business Website',
          menu: ['Home', 'Services', 'About', 'Blog', 'Contact'],
          theme: 'default-theme'
        };
    }
  };

  const template = getTemplate();

  // Parse schema markup if it exists
  const parseSchemaMarkup = () => {
    if (!content.schemaMarkup) return null;
    
    try {
      return JSON.parse(content.schemaMarkup);
    } catch (e) {
      return null;
    }
  };

  const schema = parseSchemaMarkup();
  
  // Extract business info from schema markup if available
  const businessInfo = {
    name: schema?.name || schema?.headline || template.logo,
    address: schema?.address ? 
      `${schema.address.streetAddress}, ${schema.address.addressLocality}, ${schema.address.addressRegion} ${schema.address.postalCode}` : 
      "123 Main Street, Chicago, IL 60601",
    phone: schema?.telephone || "(312) 555-1234",
    email: schema?.email || "contact@example.com"
  };

  const renderHeadings = () => {
    return content.headings.map((heading: any, index: number) => {
      const Tag = heading.tag as keyof JSX.IntrinsicElements;
      return <Tag key={index} className="preview-heading">{heading.content}</Tag>;
    });
  };

  const renderImages = () => {
    return content.images.map((image: any, index: number) => (
      <div key={index} className="preview-image-container">
        <img 
          src={image.src} 
          alt={image.alt}
          className="preview-image"
        />
        <p className="preview-image-caption">{image.alt}</p>
      </div>
    ));
  };

  const renderLinks = () => {
    return content.links.map((link: any, index: number) => (
      <a 
        key={index} 
        href={link.href} 
        className={`preview-link ${link.isInternal ? 'internal' : 'external'}`}
        onClick={(e) => e.preventDefault()}
      >
        {link.text}
        {!link.isInternal && <span className="external-icon">↗</span>}
      </a>
    ));
  };

  const renderParagraphs = () => {
    // Split body into paragraphs
    return content.body.split('\n\n').map((paragraph: any, index: number) => (
      <p key={index} className="preview-paragraph">{paragraph}</p>
    ));
  };

  return (
    <div className={`website-preview ${template.theme}`} style={{ fontFamily: template.fontFamily }}>
      {/* Page title (in browser tab) */}
      <div className="browser-mockup">
        <div className="browser-controls">
          <span className="browser-dot"></span>
          <span className="browser-dot"></span>
          <span className="browser-dot"></span>
        </div>
        <div className="browser-address-bar">
          <span className="browser-secure">🔒</span>
          <span className="browser-url">example.com</span>
        </div>
        <div className="browser-title">{content.title}</div>
      </div>

      {/* Website header */}
      <header className="website-header" style={{ backgroundColor: template.primaryColor }}>
        <div className="website-logo">{businessInfo.name}</div>
        <nav className="website-nav">
          <ul>
            {template.menu.map((item, index) => (
              <li key={index}><a href="#" onClick={(e) => e.preventDefault()}>{item}</a></li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Main content */}
      <main className="website-content">
        <div className="website-container">
          {renderHeadings()}
          
          <div className="content-flex">
            <div className="content-main">
              {renderParagraphs()}
              <div className="website-links">
                {renderLinks()}
              </div>
            </div>
            <div className="content-sidebar">
              {renderImages()}
              
              {/* Contact info from schema */}
              <div className="business-info">
                <h3>Contact Us</h3>
                <p><strong>Address:</strong> {businessInfo.address}</p>
                <p><strong>Phone:</strong> {businessInfo.phone}</p>
                <p><strong>Email:</strong> {businessInfo.email}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Website footer */}
      <footer className="website-footer" style={{ backgroundColor: template.secondaryColor }}>
        <div className="website-container">
          <div className="footer-columns">
            <div className="footer-column">
              <h4>About Us</h4>
              <p>Learn more about our services and mission.</p>
            </div>
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                {template.menu.map((item, index) => (
                  <li key={index}><a href="#" onClick={(e) => e.preventDefault()}>{item}</a></li>
                ))}
              </ul>
            </div>
            <div className="footer-column">
              <h4>Contact</h4>
              <p>{businessInfo.address}<br />{businessInfo.phone}</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} {businessInfo.name}. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* SEO Preview Overlay */}
      {difficulty === "Intermediate" || difficulty === "Advanced" ? (
        <div className="seo-preview-overlay">
          <div className="seo-info-box">
            <h4>SEO Info</h4>
            <ul>
              <li><strong>Title:</strong> {content.title.length} chars</li>
              <li><strong>Meta:</strong> {content.metaDescription.length} chars</li>
              <li><strong>H1 Tags:</strong> {content.headings.filter((h) => h.tag === 'h1').length}</li>
              <li><strong>Images Alt:</strong> {content.images.filter((img) => img.alt && img.alt.trim() !== '').length}/{content.images.length}</li>
              <li><strong>Schema:</strong> {content.schemaMarkup ? "Implemented" : "Missing"}</li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WebsitePreview;