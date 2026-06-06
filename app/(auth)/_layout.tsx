
import PublicWrapper from "@/layout/UnAuthLayout";
import { Stack } from "expo-router";
export default function AuthLayout() {
        return (<>
                <PublicWrapper>
                        <Stack screenOptions={{ headerShown: false }} />
                </PublicWrapper>
        </>);
}
