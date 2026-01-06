import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-[#f6f6f6] text-base-content py-10">
        <div className="container mx-auto px-6">
          <div className="footer grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <img src="medical-logo.png" alt="logo" className="w-35 h-25" />
              </h2>
              <p className="text-sm">Find a Beautiful Life</p>
            </div>

            <div>
              <h3 className="footer-title text-[#025e9d]">Quick Links</h3>
              <ul className="mt-2 space-y-2 list-disc ">
                <li>
                  <a className="link link-hover hover:text-[#00bcd5]" href="/">
                    Home
                  </a>
                </li>
                <li>
                  <a className="link link-hover hover:text-[#00bcd5]" href="/camps">
                    Available Camps
                  </a>
                </li>
                <li>
                  <a className="link link-hover hover:text-[#00bcd5]" href="/dashboard">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a className="link link-hover hover:text-[#00bcd5]" href="/join">
                    Join Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="footer-title text-[#025e9d]">Contact Us</h3>
              <p className="mt-2 text-sm">
                Email: medical@care.com <br />
                Phone: +14 123-4567 <br />
                Address: 123 Main Street, Dhaka, Bangladesh
              </p>
              <div className="mt-3 flex gap-4">
                <a className="link link-hover" href="#">
                  Facebook
                </a>
                <a className="link link-hover" href="#">
                  Twitter
                </a>
                <a className="link link-hover" href="#">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="bg-[#00bcd5] text-center p-5 border-t  text-sm text-white">
        © {new Date().getFullYear()} Medical Care — All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
