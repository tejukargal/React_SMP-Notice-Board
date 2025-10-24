const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Sanjay Memorial Polytechnic, Sagar
          </p>
          <p className="text-gray-500 text-xs mt-1">
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
