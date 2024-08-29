import clsx from "clsx";
import todoPng from "/src/assets/TODO.png";
import moon from "/src/assets/icon-moon.svg";
import sun from "/src/assets/icon-sun.svg";

function Header(props: {
  darkMode: boolean;
  setDarkMode: (status: boolean) => void;
}) {
  return (
    <div
      className={clsx(
        props.darkMode
          ? "md:bg-[url('/src/assets/bg-desktop-dark.jpg')] bg-[url('/src/assets/bg-mobile-dark.jpg')]"
          : "md:bg-[url('/src/assets/bg-desktop-light.jpg')] bg-[url('/src/assets/bg-mobile-light.jpg')]",
        "md:h-[19rem] flex items-start justify-center w-full h-[13rem] px-[1.5rem] py-[3rem] bg-cover bg-no-repeat"
      )}
    >
      <div className="flex justify-between items-center max-w-[33.75rem] w-full">
        <img src={todoPng} alt="todoPng" />
        <img
          onClick={() => {
            props.setDarkMode(!props.darkMode);
          }}
          className="cursor-pointer"
          src={props.darkMode ? sun : moon}
          alt="moon"
        />
      </div>
    </div>
  );
}

export default Header;
