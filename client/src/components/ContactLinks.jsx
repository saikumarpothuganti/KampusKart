import React from 'react';

const ContactLinks = () => {
  return (
    <div className="flex gap-4 justify-center">
      <a
        href="https://www.instagram.com/kampuskart_?igsh=bG9oNTdvdW5ua2ky"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-600 hover:via-pink-600 hover:to-orange-600"
      >
        Instagram
      </a>
      <a
        href="https://t.me/KampusKart_Klu"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600"
      >
        Telegram
      </a>
    </div>
  );
};

export default ContactLinks;
