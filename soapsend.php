<?php

// create soap connection with trace settings
$option=array("trace"=>1);
$fname = "test.txt";
$fh = fopen( $fname, 'r') or die("Open file failed\n");
$sXML = fread( $fh, filesize($fname) );
// echo "Sending: ".$sXML."\n";

$sURL = "https://cgram.mrsystems.co.uk:4443/Service1.svc";
$client = new SoapClient( $sURL, $option );

$header = new SoapHeader(
				'"http://schemas.microsoft.com/ws/2005/05/addressing/none"',
				'Action', 'http://tempuri.org/IService1/OrderPlacement', '"1"');
$client->__setSoapHeaders( $header );


try {
	// create soapVar with xml string
	$aToSend = array( new SoapVar( trim($sXML), XSD_ANYXML ) ); 
	// post OrderAccepted message
	$result = $client->OrderAccepted(new SoapVar( $sXML, XSD_ANYXML ) );
	// get soap response from client
	$sResponse = $client->__getLastResponse();
	echo $sResponse."\n";
	$pos = strpos( $sResponse, ">true<");
	if ($pos == false) 
		echo "Send not accepted, failed\n";
	else
		echo "OK\n";
} catch (Exception $e) {
	$message = $e->getMessage();
	echo "Error message:-\n";
	echo $message."\n";
	// echo "\n\nLast Request:-\n";
	// display soap message that was sent
	// echo $client->__getLastRequest();
	// echo "\nLast response:-\n";
	// display soap message received
	// echo $client->__getLastResponse();
	echo "Send failed\n";
}
?>
