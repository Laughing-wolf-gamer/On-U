import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react';
import Footer from '../Footer/Footer';

const FAQ = () => {
  // Example FAQ Data
  const faqData = [
    {
      question: 'What is ON-U?',
      answer:
        'ON-U is an e-commerce platform offering high-quality products across various categories like fashion, electronics, and more.',
    },
    {
      question: 'How can I place an order?',
      answer:
        'To place an order, simply browse our products, select the items you want, add them to your cart, and proceed to checkout.',
    },
    {
      question: 'What payment methods are accepted?',
      answer:
        'We accept payments via credit/debit cards, PayPal, and various other secure payment options.',
    },
    {
      question: 'How can I track my order?',
      answer:
        'Once your order is shipped, you will receive a tracking number via email. You can use it to track your order on the courier’s website.',
    },
    {
      question: 'Do you offer returns and exchanges?',
      answer:
        'Yes, we offer a 30-day return and exchange policy. Please check our return policy page for more details.',
    },
    {
      question: 'How do I contact customer support?',
      answer:
        'You can reach us through the "Contact Us" page on our website, or email us directly at support@on-u.com.',
    },
  ];

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    if (openFAQ === index) {
      setOpenFAQ(null); // Close if it's already open
    } else {
      setOpenFAQ(index); // Open the selected FAQ
    }
  };
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])

  return (
    <div >
      <div className="bg-gray-50 py-12 pb-10 px-6 lg:px-24 my-3 h-full w-full">
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Find answers to some of the most common questions about shopping on ON-U.
          </p>
        </header>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg pb-10">
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border-b border-gray-200">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left py-4 text-lg font-semibold text-gray-800 hover:bg-gray-100 focus:outline-none justify-between items-end flex rounded-md transition-all duration-300"
                >
                  {faq.question}
                  {
                    openFAQ === index ? <ChevronDown/> :<ChevronRight/>
                  }
                </button>
                
                {openFAQ === index && (
                  <div className="py-4 text-gray-600 pb-7">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer/>
    </div>
  );
};

export default FAQ;
