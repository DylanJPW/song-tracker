export function LogoutButton({ logout }: { logout: () => void }) {
  return (
    <button
      className="d-flex cursor-pointer align-items-center"
      onClick={() => logout()}
      type="button"
    >
      LOG OUT
    </button>
  );
}
