const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-white py-8">
    <div className="container mx-auto px-4 text-center">
      <div className="text-xl font-bold mb-4">EzzySave</div>
      <p className="text-sm text-gray-400">
        Manage your money, achieve your goals. &copy; 2025 EzzySave. All rights
        reserved.
      </p>
      <div className="mt-4 space-x-4 text-sm">
        <a href="#" className="hover:text-blue-400">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-blue-400">
          Terms of Service
        </a>
        <a href="#" className="hover:text-blue-400">
          Contact Us
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;