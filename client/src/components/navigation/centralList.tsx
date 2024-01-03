export default function CentralList(props: {
  redirect: (to: string) => void;
}): JSX.Element {
  return (
    <div className="navCentralList">
      <ul>
        <li onClick={() => props.redirect(`nature`)}>Nature</li>
        <li onClick={() => props.redirect(`towns`)}>Towns</li>
        <li onClick={() => props.redirect(`history`)}>History</li>
        <li onClick={() => props.redirect(`entertainment`)}>Entertainment</li>
      </ul>
    </div>
  );
}
