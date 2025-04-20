import { Expression, Expressions } from "macromaniajsx/jsx-dev-runtime";

export function Quotes(
  { children }: { children: Expressions },
): Expression {
  return (
    <>
      “<exps x={children} />”
    </>
  );
}
