import React from 'react';

function Print() {
  return (
    <div
      className='flex justify-center'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.shiftKey && e.key == 'P') {
          printModule.printPage();
          console.log('Printed');
        }
      }}
      onWheel={(e) => {
        if (e.ctrlKey) {
          if (e.deltaY > 0) {
            console.log('zoom out');
            printModule.changeZoom(-0.05);
          } else if (e.deltaY < 0) {
            console.log('zoom in');
            printModule.changeZoom(0.05);
          }
        }
      }}
    >
      <div
        className='border-2 border-black'
        style={{
          width: '210mm',
          height: '297mm',
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fringilla
        arcu eu molestie feugiat. Nullam ut metus neque. Etiam euismod diam
        erat, a lobortis risus luctus non. Praesent eget justo ut velit accumsan
        tempus. Nunc fermentum ligula at ante sodales interdum. Proin porta
        felis sed nunc viverra porttitor. Orci varius natoque penatibus et
        magnis dis parturient montes, nascetur ridiculus mus. Donec eu ligula
        non augue mattis elementum ac non nunc. Sed finibus odio felis, eget
        euismod leo tristique ac. Nam tincidunt, felis ut hendrerit finibus,
        eros enim vestibulum arcu, in consequat diam felis non ante. Aliquam ac
        diam sapien. Maecenas nec facilisis nulla. Phasellus eros lorem,
        eleifend ut velit vel, mattis pulvinar ipsum. Aenean posuere elit nec
        diam consectetur, nec varius libero commodo. Nunc molestie lectus massa,
        vitae pharetra lorem bibendum ut. Pellentesque pellentesque, lorem eu
        ullamcorper laoreet, ante velit iaculis eros, non mollis mauris massa
        sit amet eros. Nulla dictum nunc erat, in tincidunt ligula suscipit non.
        Nullam tristique id arcu sit amet scelerisque. Morbi fermentum aliquam
        interdum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
        iaculis nunc eget condimentum pharetra. Phasellus aliquam magna sodales
        ante mollis pretium. Quisque nec erat fringilla, iaculis neque ut,
        vestibulum leo. Proin quis mi ligula. Sed eu tristique sapien, at
        convallis velit. Pellentesque pretium nibh nec feugiat sodales.
        Pellentesque eget scelerisque nibh, ac malesuada urna. Vivamus sed augue
        et dolor pretium imperdiet. Phasellus blandit tellus id erat laoreet
        pulvinar. Phasellus accumsan, leo a suscipit lacinia, nisl ex aliquet
        tortor, ut pretium ante ligula a arcu. Mauris dapibus nisi sollicitudin,
        bibendum justo at, sagittis tortor. Quisque porttitor, magna quis
        sodales luctus, tellus dolor porta lacus, nec maximus enim urna sed
        lectus. Aliquam imperdiet vestibulum ante ut suscipit. Phasellus eu
        interdum nulla. Mauris ligula nulla, dignissim eget euismod at, iaculis
        a est. Nulla sed est elementum, tempor enim sed, finibus nibh. Ut et
        lorem et sem eleifend finibus at sit amet ante. Nam sit amet purus eu
        metus fringilla condimentum sed in quam. Aliquam erat volutpat. Proin
        ultricies, nisi auctor pellentesque tempus, velit ante mattis lorem,
        eget finibus dolor tortor vitae ipsum. Duis id eleifend risus, a commodo
        tellus. Fusce suscipit eu justo eget auctor. Integer vitae tortor
        ligula. Nullam nisl augue, dapibus non condimentum in, ullamcorper vel
        mi. Donec commodo elementum sem. Nam tempus consequat ligula at
        sollicitudin. Maecenas est sem, porttitor a justo sit amet, commodo
        dignissim diam. Quisque vitae urna quis dolor fringilla consequat ac sit
        amet est. Etiam porta euismod viverra. Nunc tempor vehicula aliquet.
        Nunc sed felis ac purus consectetur rutrum. Curabitur dignissim
        consectetur justo. Integer orci diam, sodales ac orci id, sollicitudin
        consectetur sapien.
      </div>
    </div>
  );
}

export default Print;
