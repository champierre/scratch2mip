# scratch2mip

scratch2mip is [ScratchX](http://scratchx.org/) extension that enables Scratch to controll balancing robot, [WowWee MiP](http://wowwee.com/mip/).

[![scratch2mip Demo](https://cloud.githubusercontent.com/assets/10215/15634434/71dd4b4a-25fe-11e6-9746-d2eaa98774b6.gif)](https://youtu.be/sXMXr9e-npw)

## Platforms

- MacOS 10.10.5(Yosemite)
  - node.js is required
- Windows 10
	- Setup instruction is available at [http://swikis.ddo.jp/WorldStethoscope/59](http://swikis.ddo.jp/WorldStethoscope/59) (Japanese)
- Raspberry Pi 3
  - Setup instruction is available at [http://nasu-lab.blogspot.jp/2016/06/raspberry-pi-3scratch2mip.html](http://nasu-lab.blogspot.jp/2016/06/raspberry-pi-3scratch2mip.html) (Japanese)

## Install Helper App

To controll MiP, Helper App needs to be installed. You need node.js to run it.

```
% cd workdir
% wget https://champierre.github.com/scratch2mip/scratch2mip_helper.zip
% unzip scratch2mip_helper.zip
% cd scratch2mip_helper
% npm install
```

## Run scratch2mip

1. Open [ScratchX](http://scratchx.org/) page.
2. Click "Open Extension URL" and paste the following URL, then click "Open".

	```
	http://champierre.github.io/scratch2mip/scratch2mip.js
	```
3. On Warning dialog, click "I understand, continue" if you trust scratch2mip.
4. Turn on Wowwee MiP.
5. Run the Helper App:

	```
	cd workdir/scratch2mpi_helper
	node scratch2mip_helper.js
	```
6. If the Helper App successfully connects to the robot, it lists your MiP. Choose the robot you want to controll.

	![scratch2mip_helper](http://champierre.github.io/scratch2mip/images/scratch2mip_helper.png)
7. If the Helper App says "Server listening on...", you can controll MiP from ScratchX using the following custom blocks.

	![blocks](http://champierre.github.io/scratch2mip/images/blocks.png?201605300033)

	![blocks](http://champierre.github.io/scratch2mip/images/mip_square.png)
