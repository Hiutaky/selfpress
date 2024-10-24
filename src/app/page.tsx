import BaseLayout, {
  BaseLayoutContainer,
} from "~/components/sections/BaseLayout";
import Heading from "~/components/shared/Heading";

export default function Home() {
  return (
    <BaseLayout>
      <BaseLayoutContainer>
        <div className="flex flex-col gap-2">
          <Heading>Welcome!</Heading>
          <span>Dashboard is still under construction.</span>
        </div>
      </BaseLayoutContainer>
    </BaseLayout>
  );
}
