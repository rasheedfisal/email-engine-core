import { forwardRef } from "react";
import Loader from "./loader";
import { Button as ShadCnButton, ButtonProps } from "@/components/ui/button";

type Props = {
  title: string;
  clicked?: boolean;
  loadingTitle?: string;
  icon?: JSX.Element;
} & ButtonProps;
const SubmitButton = forwardRef<HTMLButtonElement, Props>(
  (
    { title, clicked = false, loadingTitle = "", icon = undefined, ...props },
    ref
  ) => {
    return (
      <ShadCnButton {...props} ref={ref}>
        {clicked ? (
          <div className="flex items-center gap-2">
            <Loader color="white" />
            {loadingTitle !== "" && (
              <span className="font-bold">{loadingTitle}</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-bold">{title}</span>
            {icon !== undefined && <div>{icon}</div>}
          </div>
        )}
      </ShadCnButton>
    );
  }
);
SubmitButton.displayName = "SubmitButton";
export default SubmitButton;
