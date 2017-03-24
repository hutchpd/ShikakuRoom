<?php
/*
// Paul Hutchinson A466442
// Tesla.php
// This script works out an efficent path for my shikaku solver to follow.
// It uses a breadth first aproach to filling a table with squares of width and height 2^x
// Each square is then filled with a hilbert curve of relevent order. The resulting path is an
// array of co-ordinates that can be followed.
*/


global $offsetx,$offsety;//These values indicate the bottom left square for the hilbert curve.

//Works out the smallest value of 2^a that fits into this area (hilbert curves only fit into areas of width 2^a)
function reduce($x,$y){
	$i=-1;
	$j=0;
	while($j<=$x&&$j<=$y){
		$i++;
		$j=pow(2, $i);
	}
	return --$i;
}
//Moves the path forward on whichever angle it happens to be facing. Instead of using 0 90 180 270 and 360 I've simplfied it to 0 90 -90 and 180
//Each node visited is pushed to the out path.
function forward(){
	global $out,$direction,$offsetx,$offsety;//All the inputs are global as they are relative to other functions.
	if (($direction==90)||($direction==-90)){//A simple left or right switch.
		$offsetx=$offsetx+($direction/90);//A sneaky way of moving relative to the angle.
	} else {
		$offsety=$offsety-(($direction-90)/90);//I use the same trick here, this time the input is either 180 or 0.
	}
	array_push($out,array($offsetx,$offsety));
}
//Changes the angle relative to the previous.
function turn($angle){
	global $direction;
	if(-90>($direction+$angle)){
		$direction=180;
	} elseif(($direction+$angle)>180){
		$direction=-90;
	} else {
		$direction=$direction+$angle;
	}
}
//an iterative aproach to drawing a hilbert curve.
function left($n){
	if($n==0){
		return 0;
	}
	turn(90);
	right($n-1);
	forward();
	turn(-90);
	left($n-1);
	forward();
	left($n-1);
	turn(-90);
	forward();
	right($n-1);
	turn(90);
}
//Opposite to above.
function right($n){
	if($n==0){
		return 0;
	}
	turn(-90);
	left($n-1);
	forward();
	turn(90);
	right($n-1);
	forward();
	right($n-1);
	turn(90);
	forward();
	left($n-1);
	turn(-90);
}
//Launching the hilbert curve.
function hilbert($order){
	global $out;
	global $offsetx,$offsety;
	$out=array();
	$direction = 0;
	array_push($out,array($offsetx,$offsety));
	left($order);
	return $out;
}
//A Breadth first aproach to reducing the table to as few 2^a squares as possible.
function treeout($x,$y,$offsetx1,$offsety1,$ylimit1){
	if($ylimit1==0||$x-$offsetx1==0){//In this case we have treed in a direction that is unessasary.
		return array();
	}
	global $order,$offsetx,$offsety;
	$order=reduce($x-$offsetx1,$ylimit1);//Finds the smallest 2^a square that will fit in this area.
	$offsetx=$offsetx1;
	$offsety=$offsety1;
	$path = hilbert($order);//Gets the path that will fit here.
	$power=pow(2,$order);
	$path2=treeout($x,$y,$offsetx1+$power,$offsety1,$power);//Tree's out to the right.
	$path3=treeout($x,$y,$offsetx1,$offsety1+$power,$ylimit1-$power);//Tree's out upwards.
	$path=array_merge($path,array_merge($path2,$path3));//Moving up the tree.
	return $path;
}
$path=treeout($x,$y,0,0,$y);
return $path;
?>
