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
		$answer[$p[1]][$p[0]]=array($p[1],$p[0]);
	}
}

$answer = solve($path,$answer,array());

$return=$answer[2];
$answer = $answer[1];

if(is_array($return)){
	echo "<?xml version=\"1.0\"?>\n";
	echo "<puzzle>\n";
	if(count($return)==count($path)){
		echo "\t<status>SolvedL</status>\n";
	} else {
		echo "\<status>Partial</status>\n";
	}
	$tehnumber=count($return)-1;
	echo "\t<number>$tehnumber</number>\n";
	$xx=0;
	foreach($return as $shape){
		$cell=$shape[0];
		echo "\t<firstboxx$xx>$cell[1]</firstboxx$xx>\n\t<firstboxy$xx>$cell[0]</firstboxy$xx>\n";
		$cell=$shape[1];
		echo "\t<lastboxx$xx>$cell[1]</lastboxx$xx>\n\t<lastboxy$xx>$cell[0]</lastboxy$xx>\n";
		$xx++;
	}
	echo "<time>(Logic derived in) ";
	echo gentime();
	echo " seconds</time>";
	if(count($return)!=count($path)){
		for($i = 0; $i < $y; $i++){ //for each row
			for($j = 0; $j < $x; $j++){ //for each collum
				echo "<cellw$i"."h$j>";
				echo $answer[$i][$j][0];
				echo ":";
				echo $answer[$i][$j][1];
				echo "</cellw$i"."h$j>";
			}
		}
	}
	echo "</puzzle>";
} else {
	echo "<?xml version=\"1.0\"?>\n";
	echo "<puzzle>\n";
	echo "\t<status>Nada</status>\n";
	echo "</puzzle>";
}
function gentime() {
    static $a;
    if($a == 0) $a = microtime(true);
    else return (string)(microtime(true)-$a);
}
/* This function does a pass of reach, if reach found any new information, then it repeats. If the answer has been found, then it returns it. If however reach can't solve the puzzle, then it does the opposite using the information reach produced by running unreach*/
function solve($path,$answer,$ret){
	$return=array();
	$change=0;
	while(is_array($return)){
		$return=reach($path,$answer,$ret);
		if($return){
			$change=1;
			$path=$return[0];
			$answer=$return[1];
			$ret=$return[2];
		}
	}
	$return=array();
	while(is_array($return)){
		$return=unreach($path,$answer,$ret);
		if($return){
			$change=1;
			$path=$return[0];
			$answer=$return[1];
			$ret=$return[2];
		}
	}
	if($change){
		$return=solve($path,$answer,$ret);
		if($return){
			return $return;
		} else {
			return array($path,$answer,$ret);
		}
	} else {
		return 0;
	}
}
/*This function gets each number to ask the question "based on where only I can reach, what shapes look like they fit?" if there is only one shape that can fit, then it puts it in. */
//"how many shapes fit?"
function unreach($path,$answer,$ret){
	global $width, $height;
	$unreach=array();
	$change=0;
	for ($m = 0; $m < count($path); $m++){//for each path?
		$t=$path[$m];
		$n=$t["area"];
		$factor=getshapes($n);
		foreach($factor as $sum){
			for ($k = 0; $k < $n; $k++) {//for each pivot point
				$return=pivot($sum,$k,$t["x"],$t["y"],$answer);
				if($return){
					if(count($unreach[$t["x"]][$t["y"]])){//only way to type set in php
						array_push($unreach[$t["x"]][$t["y"]],$return);
					} else {
						$unreach[$t["x"]][$t["y"]]=array($return);
					}
				}
			}
		}
		if(count($unreach[$t["x"]][$t["y"]])==1){
			$change=1;
			unset($path[$m]);
			array_push($ret,$unreach[$t["x"]][$t["y"]][0][1]);
			$answer=$unreach[$t["x"]][$t["y"]][0][0];
		}
	}
	$path=array_values($path);
	if($change==0){
		return 0;
	}
	$path=array_values($path);
	return array($path,$answer,$ret);
}

/* This function gets each number to ask the question "where can I reach?", if there is a cell that only it can reach, then it belongs to it. (simmaler to a technique used to solve sukuo puzzles)*/
//"how many numbers reach this square?"
function reach($path,$answer,$ret){
	global $width, $height;
	$reach=array();
	$count=array();
	$change=0;
	foreach($path as $t){
		$n=$t["area"];
		$factor=getshapes($n);
		foreach($factor as $sum){
			for ($k = 0; $k < $n; $k++) {//for each pivot point
				$return=pivot2($sum,$k,$t["x"],$t["y"],$answer,$reach);
				$reach=$return[0];
				if($return[1]){
					$count[$t["x"]][$t["y"]]=$count[$t["x"]][$t["y"]]+1;//so that NULL+1=1
				}
			}
		}
	}
	$answer1=array();
	for ($m = 0; $m < count($path); $m++){
		$t=$path[$m];
		$bigesti=NULL;
		$bigestj=NULL;
		$smallesti=NULL;
		$smallestj=NULL;
		for($i = 0; $i < $width+1; $i++){ //for each row
			for($j = 0; $j < $height+1; $j++){ //for each collum
				//do this last, just in case joining two sections results in completion
				if($answer[$i][$j]===NULL){
					$countreach=count($reach[$i][$j]);
					$keys=array();
					if($countreach>0){
						$keys=array_keys($reach[$i][$j], array($t["x"],$t["y"]));//does a search
						$countkeys=count($keys);
						if($countkeys==$countreach){
							if($bigesti===NULL){
								$bigesti=$i;
								$smallesti=$i;
								$smallestj=$j;
								$bigestj=$j;
							}
							if($j>$bigestj){
								$bigestj=$j;
							}
							if($i>$bigesti){
								$bigesti=$i;
							}
							if($j<$smallestj){
								$smallestj=$j;
							}
						}
						if($count[$t["x"]][$t["y"]]==count($keys)&&$count[$t["x"]][$t["y"]]!=NULL){
							$answer[$i][$j]=array($t["x"],$t["y"]);
						}
					}
				}
			}
		}
		if($bigestj!==NULL){
			$fill=fillme($bigestj,$bigesti,$smallestj,$smallesti,$answer,$t);
			if($fill[1]){
				$answer=$fill[0];
				$change=1;
			}
			if(((($bigesti+1)-$smallesti)*(($bigestj+1)-$smallestj))==$t["area"]){
				array_push($ret,array(array($smallesti,$smallestj),array($bigesti,$bigestj)));
				unset($path[$m]);
			}
		}
	}
	
	if($change==0){
		return 0;
	}
	$path=array_values($path);
	return array($path,$answer,$ret);
}

function fillme($bigestj,$bigesti,$smallestj,$smallesti,$answer,$t){
	$change=0;
	for($i = $smallesti; $i < $bigesti+1; $i++){ // for each row
		for($j = $smallestj; $j < $bigestj+1; $j++){ //for each collum
			if($answer[$i][$j]===NULL){
				$answer[$i][$j]=array($t["x"],$t["y"]);
				$change=1;
			}
		}
	}
	return array($answer,$change);
}

function pivot2($sum,$k,$x,$y,$answer,$reach){
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
				return array($reach,0);
			}
		}
	}
	foreach ($answer0 as $a){
		if(count($reach[$a[0]][$a[1]])){//PHP is an implicit language and requires that you've implied that a variable is an array before you push to it (stupid really)
			array_push($reach[$a[0]][$a[1]],array($x,$y));
		} else {
			$reach[$a[0]][$a[1]]=array(array($x,$y));
		}
	}
	return array($reach,1);
}

function pass($path,$answer){
	$return=number($path,$answer);
	if(count($return[0])==count($answer)){
		return 0;
	} else {
		return pass($return[0],$return[1]);
	}
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
/* Does that shape fit? */
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
