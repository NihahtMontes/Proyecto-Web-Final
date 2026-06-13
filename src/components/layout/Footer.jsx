export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-6 text-center mt-auto">
      <p className="text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} ByteHotel. Todos los derechos reservados.
      </p>
    </footer>
  );
}