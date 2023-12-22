import TabWrapper from "../../TabWrapper";
import { PTxt } from "../../text";

const HomeScrnTab = () => {
    return (
        <TabWrapper style={{ width: '100%', position: 'relative', display: 'flex', borderWidth: 1, height: 150 }}>
            <PTxt>Home</PTxt>
        </TabWrapper>
    )
};

export default HomeScrnTab;