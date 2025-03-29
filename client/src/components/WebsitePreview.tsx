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
          
          <div className="browser-tabs">
            <div className="browser-tab active">
              {industry === 'e-commerce' ? 'Shop' : industry === 'healthcare' ? 'Health Info' : 'Main Page'}
            </div>
            <div className="browser-tab">
              {industry === 'e-commerce' ? 'Products' : industry === 'healthcare' ? 'Services' : 'About'}
            </div>
            <div className="browser-tab">
              {industry === 'e-commerce' ? 'Cart' : industry === 'healthcare' ? 'Appointments' : 'Contact'}
            </div>
          </div>
        </div>
        
        <div className="browser-address-bar">
          <span className="browser-secure">🔒</span>
          <span className="browser-url">
            {industry === 'e-commerce' 
              ? `shop.example.com/${content.title.toLowerCase().replace(/\s+/g, '-')}`
              : industry === 'healthcare'
                ? `health.example.com/${content.title.toLowerCase().replace(/\s+/g, '-')}`
                : `www.example.com/${content.title.toLowerCase().replace(/\s+/g, '-')}`
            }
          </span>
          
          <div className="browser-controls-right">
            <span className="browser-button">⟳</span>
            <span className="browser-button">⋮</span>
          </div>
        </div>
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
            <h4>SEO Analysis</h4>
            <ul>
              <li>
                <strong>Title:</strong> 
                <span className={
                  content.title.length < 30 ? 'seo-error' : 
                  content.title.length > 60 ? 'seo-warning' : 'seo-good'
                }>
                  {content.title.length} chars
                  {content.title.length < 30 ? ' (too short)' : 
                   content.title.length > 60 ? ' (too long)' : ' (optimal)'}
                </span>
              </li>
              <li>
                <strong>Meta:</strong> 
                <span className={
                  content.metaDescription.length < 70 ? 'seo-error' : 
                  content.metaDescription.length > 160 ? 'seo-warning' : 'seo-good'
                }>
                  {content.metaDescription.length} chars
                  {content.metaDescription.length < 70 ? ' (too short)' : 
                   content.metaDescription.length > 160 ? ' (too long)' : ' (optimal)'}
                </span>
              </li>
              <li>
                <strong>H1 Tags:</strong> 
                <span className={
                  content.headings.filter(h => h.tag === 'h1').length === 0 ? 'seo-error' :
                  content.headings.filter(h => h.tag === 'h1').length > 1 ? 'seo-warning' : 'seo-good'
                }>
                  {content.headings.filter(h => h.tag === 'h1').length}
                  {content.headings.filter(h => h.tag === 'h1').length === 0 ? ' (missing)' : 
                   content.headings.filter(h => h.tag === 'h1').length > 1 ? ' (too many)' : ' (optimal)'}
                </span>
              </li>
              <li>
                <strong>Images Alt:</strong> 
                <span className={
                  content.images.filter(img => img.alt && img.alt.trim() !== '').length === 0 ? 'seo-error' :
                  content.images.filter(img => img.alt && img.alt.trim() !== '').length !== content.images.length ? 'seo-warning' : 'seo-good'
                }>
                  {content.images.filter(img => img.alt && img.alt.trim() !== '').length}/{content.images.length}
                  {content.images.filter(img => img.alt && img.alt.trim() !== '').length === 0 ? ' (all missing)' : 
                   content.images.filter(img => img.alt && img.alt.trim() !== '').length !== content.images.length ? ' (some missing)' : ' (all set)'}
                </span>
              </li>
              <li>
                <strong>Schema:</strong> 
                <span className={content.schemaMarkup ? 'seo-good' : 'seo-error'}>
                  {content.schemaMarkup ? "Implemented ✓" : "Missing ✗"}
                </span>
              </li>
              <li>
                <strong>Keywords:</strong> 
                <span className={
                  content.body.toLowerCase().includes('coffee') && 
                  content.body.toLowerCase().includes('beans') ? 'seo-good' : 'seo-warning'
                }>
                  {content.body.toLowerCase().includes('coffee') && 
                   content.body.toLowerCase().includes('beans') ? "Well placed" : "Check usage"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WebsitePreview;