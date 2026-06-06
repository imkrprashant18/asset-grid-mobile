
import { View } from "react-native";
import AppInput from "../ui/input";

type Props = {
    control: any;
};

export default function SearchHeader({ control }: Props) {
    return (
        <View className="mb-4">
            <AppInput
                control={control}
                name="search"
                label="Search Assets"
                placeholder="Search by name, serial number..."
                leftIcon="magnify"
            />
        </View>
    );
}