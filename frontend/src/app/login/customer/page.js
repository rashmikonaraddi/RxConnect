import LoginForm from "@/components/LoginForm";

export default function CustomerLogin() {
  return (
    <main className="
      min-h-screen
      bg-gradient-to-br
      from-blue-100
      via-white
      to-cyan-100
      flex
      items-center
      justify-center
      px-6
    ">

      <LoginForm role="Customer" />

    </main>
  );
}