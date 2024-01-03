import { Dispatch, SetStateAction } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../../img/logo.png";

export default function NavigationLogo(props: {
  redirect: (to: string) => void;
  setOpenMenu: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  return (
    <>
      <RxHamburgerMenu
        className="navIcon"
        onClick={() => props.setOpenMenu(true)}
      />
      <div className="navCentral" onClick={() => props.redirect(`home`)}>
        <img src={logo} alt="logo"></img>
        <div>Croatia Travel Advisor</div>
      </div>
    </>
  );
}
