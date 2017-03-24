<?php
header("Content-type: text/xml");
global $height, $width;

gentime();

$height = $_REQUEST["width"];
$width = $_REQUEST["height"];

$x=$width+1;
$y=$height+1;
$path1 = include 'tesla.php';
$map=array();
$path=array();
$answer=array();

foreach ($path1 as $p){
	$requestval="cellw$p[0]h$p[1]";
	$value=$_REQUEST["$requestval"];
	if($value){
		$cell=array("x"=>$p[1],"y"=>$p[0],"area"=>$value);
		array_push($path,$cell);
	}
	$requestval="cellaw$p[1]h$p[0]c0";
	$value=$_REQUEST["$requestval"];
	if($value!=NULL){
		$requestval="cellaw$p[1]h$p[0]c1";
		$value2=$_REQUEST["$requestval"];
		$answer[$p[1]][$p[0]]=array((int)$value,(int)$value2);//I have to typeset here as I require using ===
	}
}

$answer2=array();

$return = number($path,$answer);

if($return){
	echo "<?xml version=\"1.0\"?>\n";
	echo "<puzzle>\n";
	echo "\t<status>Solved</status>\n";
	$tehnumber=count($return)-1;
	echo "\t<number>$tehnumber</number>\n";
	$x=0;
	foreach($return as $shape){
		$cell=$shape[0];
		echo "\t<firstboxx$x>$cell[1]</firstboxx$x>\n\t<firstboxy$x>$cell[0]</firstboxy$x>\n";
		$cell=$shape[1];
		echo "\t<lastboxx$x>$cell[1]</lastboxx$x>\n\t<lastboxy$x>$cell[0]</lastboxy$x>\n";
		$x++;
	}
	echo "<time>(solved in) ";
	echo gentime();
	echo " seconds</time>";
	echo "</puzzle>";
}
else {
	echo "<?xml version=\"1.0\"?>\n";
	echo "<puzzle>\n";
	echo "\t<status>Not</status>\n";
	echo "</puzzle>";
}
function gentime() {
    static $a;
    if($a == 0) $a = microtime(true);
    else return (string)(microtime(true)-$a);
}
function number($path,$answer){
	if($path!=array()){
		$t=array_pop($path);
		$n=$t["area"];
		$factor=getshapes($n);
		foreach($factor as $sum){
			for ($k = 0; $k < $n; $k++) {//for each pivot point
				$return=pivot($sum,$k,$t["x"],$t["y"],$answer);
				if($return){
					if($path!=array()){
						$ret=number($path,$return[0]);
						$answer2=mergeit($ret,$return[1]);
					} else {
						$answer2 = array($return[1]);
					}
					if($answer2!=0){
						return $answer2;
					}
				}
			}
		}
	} else {
		return 1;
	}
}

function findposition($sum,$k){
	$q=0;
	for ($i= 0; $i < $sum[0]; $i++) {//for each row
		for ($j = 0; $j < $sum[1]; $j++) {//for each colum
			if($q==$k){
				return array($i,$j);
			}
			$q++;
		}
	}
}

function pivot($sum,$k,$x,$y,$answer){
	$answer0=array();
	global $width, $height;
	$position=findposition($sum,$k);
	for ($i= 0; $i < $sum[0]; $i++) {//for each row
		for ($j = 0; $j < $sum[1]; $j++) {//for each colum
			$relativei=$i-$position[0];
			$relativej=$j-$position[1];
			$return=works($i,$j,$relativei,$relativej,$height,$width,$x,$y,$answer);
			if($return){
				array_push($answer0,$return);
			} else {
				return 0;
			}
		}
	}
	for ($i= 0; $i < $width+1; $i++) {//for each row
		for ($j = 0; $j < $height+1; $j++) {//for each colum
			if($answer[$i][$j][0]===$x&&$answer[$i][$j][1]===$y){//if the answer belongs to me
				$test=0;
				foreach($answer0 as $a){// Check the shape covers it
					if($a[0]===$i&&$a[1]===$j){
						$test=1;
					}
				}
				if($test==0){
					return 0;
				}
			}
		}
	}
	$answer3=array();
	foreach($answer0 as $a){
		$answer[$a[0]][$a[1]][0]=$x;
		$answer[$a[0]][$a[1]][1]=$y;
	}
	array_push($answer3,array_pop($answer0));
	array_push($answer3,array_shift($answer0));
	return array($answer,$answer3);
}
function works($i,$j,$relativei,$relativej,$height,$width,$x,$y,$answer){
	$test=0;
	if($x+$relativei<0||$x+$relativei>$height||$y+$relativej<0||$y+$relativej>$width){//testing that the shape been tried doesn't go outside of the puzzle
		return 0;
	} elseif(($answer[$x+$relativei][$y+$relativej][0]===NULL&&$answer[$x+$relativei][$y+$relativej][1]===NULL)||($answer[$x+$relativei][$y+$relativej][0]===$x&&$answer[$x+$relativei][$y+$relativej][1]===$y)){
	} else {
		return 0;
	}
	return array($x+$relativei,$y+$relativej);
}

function getshapes($n){
	$factors=array();
	array_push($factors,array($n,1));
	$m=$n%2;
	$m=$n/2-$m/2;
	while($m!=0){
		if($n%$m==0){
			array_push($factors,array($m,$n/$m));
		}
		$m--;
	}
	return $factors;
}
/*essentually just an array_merge only it deals with the fact that number can return either a "I've got to the end of the puzzle" or "That doesn't work!" state*/
function mergeit($value,$value2){
	if($value==1){
		return array($value2);
	} elseif($value&&$value2){
		return array_merge($value,array($value2));
	} else {
		return 0;
	}
}
?>
