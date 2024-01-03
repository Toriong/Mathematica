import "react-native-gesture-handler"
import LogicGameAppNavigation from './Navigation';
import RequestComps from "./request_comps/RequestComps";

export default function App() {
  return (
    <>
      <RequestComps />
      <LogicGameAppNavigation />
    </>
  );
}
