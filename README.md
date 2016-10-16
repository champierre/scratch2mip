# scratch2mip

scratch2mip is [ScratchX](http://scratchx.org/) extension that enables Scratch to control balancing robot, [WowWee MiP](http://wowwee.com/mip/).

[![scratch2mip Demo](http://champierre.github.io/scratch2mip/images/scratch2mip.gif?201610022307)](https://youtu.be/sXMXr9e-npw)

## Platforms

- MacOS 10.10.5(Yosemite)
  - node.js is required
- Windows 10
	- Setup instruction is available at [http://swikis.ddo.jp/WorldStethoscope/59](http://swikis.ddo.jp/WorldStethoscope/59) (Japanese)
- Raspberry Pi 3
  - Setup instruction is available at [http://nasu-lab.blogspot.jp/2016/06/raspberry-pi-3scratch2mip.html](http://nasu-lab.blogspot.jp/2016/06/raspberry-pi-3scratch2mip.html) (Japanese)
- Raspberry Pi 2
  - Setup instruction is available at
  [http://nasu-lab.blogspot.jp/2016/06/raspberry-pi-2scratch2mip.html](http://nasu-lab.blogspot.jp/2016/06/raspberry-pi-2scratch2mip.html) (Japanese)

## Install Helper App

To control MiP, Helper App needs to be installed. You need node.js to run it.

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
6. If the Helper App successfully connects to the robot, it lists your MiP. Choose the robot you want to control.

	![scratch2mip_helper](http://champierre.github.io/scratch2mip/images/scratch2mip_helper.png)
7. If the Helper App says "Server listening on...", you can control MiP from ScratchX using the following custom blocks.

	![blocks](http://champierre.github.io/scratch2mip/images/blocks.png?201605300033)

8. Demo Project: [scratch2mip_demo.sbx](http://champierre.github.io/scratch2mip/scratch2mip_demo.sbx)

	![blocks](http://champierre.github.io/scratch2mip/images/mip_square.png)

## Remote Sensor Protocol version for Scratch 1.4

If you want to control MiP from Scratch 1.4, use scratch2mip_helper/scratch2mip_rsc.js.

1. Start Scratch 1.4.

2. Enable "remote sensor connections"(Click "Sensing" on the top left area, then right click on "slider sensor value". Select "enable remote sensor connections" in the context menu.)

  ![remote sensor connections](http://champierre.github.io/scratch2mip/images/rsc.png)

3. Run the Helper App RSC version:

	```
	cd workdir/scratch2mpi_helper
	node scratch2mip_rsc.js
	```

4. Use "broadcast" blocks to control MiP

  ![broadcast blocks](http://champierre.github.io/scratch2mip/images/broadcast_blocks.png)
