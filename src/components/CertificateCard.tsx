import {Box, Button, Flex, Heading, Text} from "@chakra-ui/react";
import {PiCertificateBold} from "react-icons/pi";
import {FC} from "react";
import {Certificate} from "../types/Certificate.ts";
import {IoCloudDownloadOutline} from "react-icons/io5";
import {Tooltip} from "./ui/tooltip.tsx";

type CertificateCardProps = {
    certificate: Certificate;
}

const CertificateCard: FC<CertificateCardProps> = ({certificate}) => {
    return (
        <Box
            rounded="lg"
            padding={5}
            borderWidth={1}
            boxShadow="md"
            _hover={{boxShadow: 'lg', transform: 'scale(1.01)'}}
            transition="all 0.2s"
            cursor="pointer"
        >
            <Box
                border="2px dashed"
                borderColor="gray.300"
                rounded="lg"
                height="100%"
                padding={6}
                pb={3}
                bg="white"
            >
                <Flex justifyContent="space-between" mb={4} direction="row" gap={2} alignItems="self-start">
                    <Heading size="lg" color="gray.700">
                        {certificate.courseName}
                    </Heading>

                    <PiCertificateBold style={{flexShrink: 0}} size={28} color="#caa271"/>
                </Flex>
                <Flex justifyContent="space-between" alignItems="center">
                    <Flex gap={2} alignItems="center">
                        <Text fontSize="22px" fontFamily="'Alex Brush', serif">Teachme,</Text>
                        <Text fontSize="md" fontFamily="'Alex Brush', serif">{new Date(certificate.completionDate).toLocaleDateString()}</Text>
                    </Flex>

                    <Tooltip content={"Download Certificate"}>
                        <Button unstyled cursor="pointer"
                                _hover={{color: "gray.500"}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(certificate.blobLink, "_blank");
                                }}
                        >
                            <IoCloudDownloadOutline size={22} />
                        </Button>
                    </Tooltip>
                </Flex>
            </Box>
        </Box>
    );
};

export default CertificateCard;
