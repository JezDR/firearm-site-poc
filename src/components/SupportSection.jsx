function SupportSection() {
  const supportItems = [
    {
      icon: '📞',
      title: 'Need Assistance?',
      subtitle: 'Looking for the perfect product?',
      description: 'Our experts are here to help! Whether you\'re looking for a specific item or need guidance, we can assist you in finding what suits you best. Got questions about products, availability, or accessories? Let us help you find what you need.'
    },
    {
      icon: '📋',
      title: 'Services',
      subtitle: 'Get Professional Help',
      description: 'Need assistance with your order or have questions about our services? Our team can assist you with the process. We offer expert advice to ensure you get exactly what you need. Contact us today for support!'
    },
    {
      icon: '🔒',
      title: 'Secure Storage',
      subtitle: 'Let us keep them safe',
      description: 'Looking for safe and secure storage solutions? We offer secure storage options, ensuring your items are kept in compliance with regulations. Our facility provides a secure environment to guarantee peace of mind.'
    }
  ];

  return (
    <div className="custom-support" style={{ paddingTop: '50px', paddingBottom: '50px', backgroundColor: '#2a2a2a' }}>
      <div className="container">
        <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
          {supportItems.map((item, index) => (
            <div key={index} className="col-md-4" style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '48px', lineHeight: '58px' }}>{item.icon}</span>
              </div>
              <div className="content" style={{ textAlign: 'center' }}>
                <h2 style={{ marginBottom: '10px', fontSize: '24px', color: '#fff' }}>{item.title}</h2>
                <em style={{ display: 'block', marginBottom: '15px', fontStyle: 'italic', color: '#999' }}>
                  {item.subtitle}
                </em>
                <p style={{ lineHeight: '1.6', color: '#ccc' }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SupportSection;

