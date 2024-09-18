import { IconButton} from '@chakra-ui/react';
import { FaMicrophone } from "react-icons/fa";

export default function MicrophoneButton({setText}) {
    const size = "5vw";
    return (
        <IconButton icon={<FaMicrophone/>} h={size} w={size} />
    );
}