import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-zinc-950 min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Info Column */}
        <div>
          <span className="text-red-500 font-bold tracking-wider uppercase text-sm mb-2 block">Get In Touch</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-gray-400 text-lg mb-12">
            We would love to hear from you. Whether you have a prayer request, testimony, or inquiry, feel free to reach out.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                <MapPin className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white mb-1">Main Sanctuary</h3>
                <p className="text-gray-400">Bole Sub-city, Woreda 03<br/>Addis Ababa, Ethiopia</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                <Mail className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white mb-1">Email Us</h3>
                <p className="text-gray-400">info@betelfage.org<br/>prayer@betelfage.org</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                <Phone className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white mb-1">Call Us</h3>
                <p className="text-gray-400">+251 11 123 4567<br/>+251 91 123 4567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-xl">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <Send className="text-green-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-gray-400">Thank you for contacting us. We will respond shortly.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-8 text-red-500 font-bold hover:text-red-400"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">First Name</label>
                  <input required type="text" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Last Name</label>
                  <input required type="text" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Email Address</label>
                <input required type="email" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Subject</label>
                <select className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none">
                  <option>General Inquiry</option>
                  <option>Prayer Request</option>
                  <option>Testimony</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Message</label>
                <textarea required rows={5} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition shadow-lg shadow-red-900/30">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
