import notfoundimg from "../assets/404.jpg";

export default function NotFound() {
  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <img src={notfoundimg} alt="Not Found 404" />
    </div>
  );
}
