// Pane defaults
export type PaneSizes = {
  sizeLandscapePaneLeft: number;
  sizeLandscapePaneRight: number;
  sizeLandscapePaneTopRight: number;
  sizeLandscapePaneBottomRight: number;
  sizePortraitPaneTop: number;
  sizePortraitPaneMid: number;
  sizePortraitPaneBot: number;
};

export const resetPaneSizes = (): PaneSizes => {
  return {
    sizeLandscapePaneLeft:          65,
    sizeLandscapePaneRight:         35,
    sizeLandscapePaneTopRight:      40,
    sizeLandscapePaneBottomRight:   60,
    sizePortraitPaneTop:            65,
    sizePortraitPaneMid:            25,
    sizePortraitPaneBot:            10,
  }
};

export const moveContent = (idContent:string, idContainer:string) => {
  const source = document.querySelector('#' + idContent);
  const dest = document.querySelector('#' + idContainer);
  dest.appendChild(source);
};

export const moveContentToStaging = () => {
  moveContent('ct1', 'cr-staging');
  moveContent('ct2', 'cr-staging');
  moveContent('ct3', 'cr-staging');
};

export const returnContentToSplit = () => {
  moveContent('ct1', 'cr-pane1');
  moveContent('ct2', 'cr-pane2');
  moveContent('ct3', 'cr-pane3');
};

export const showView = (currentView:number) => {
  if (currentView == 0) { // split pane
    document.querySelector('#cr-full').style.display = "none";
    document.querySelector('#cr-panes').style.display = "block";
  } else if (currentView > 0) {      
    document.querySelector('#cr-full').style.display = "block";
    document.querySelector('#cr-panes').style.display = "none";
  }
}