function getVideoEnd(la_video) {
  return la_video.createdTs + la_video.duration_ms;
}

export function mergeTimelines(/*Object*/ metaByStreamer, /*String[]*/ streamers) {
  console.log('MERGE TIMELINES');
  const out = {};
  
  //const allVideosNotPersisted = [];
  const allVideosPersisted = [];
  streamers.forEach(streamerName => {
    const streamerMetas = metaByStreamer[streamerName];
    Object.values(streamerMetas).forEach(vodMeta => {
      if (vodMeta.permanent_id) {
        allVideosPersisted.push(vodMeta);
      }
      else {
        //allVideosNotPersisted.push(vodMeta);
      }
      //allVideos.push(vodMeta);
    });
  });
  
  return mergeTimeline_sub(allVideosPersisted);
  
  //return out;
}

function mergeTimeline_sub(allVideos) {
  const out = {};
  
  allVideos.sort(
    (a, b) => a.createdTs - b.createdTs
  );
  
  if (allVideos.length > 0) {
    let i = 0;
    
    let mergedVideo = { ...allVideos[0] };
    allVideos.forEach(video => {
      //const le_debut_de_la_video_en_cours_de_merging = la_video_en_cours_de_merging.createdTs;
      const mergedVideoEnd = getVideoEnd(mergedVideo);
      
      if (video.createdTs < mergedVideoEnd) {
        const videoEnd = getVideoEnd(video);
        const maxVideoEnd = Math.max(mergedVideoEnd, videoEnd);
        mergedVideo.duration_ms = maxVideoEnd - mergedVideo.createdTs;
      }
      else {
        out[i] = mergedVideo;
        i++;
        mergedVideo = { ...video };
      }
    });
    out[i] = mergedVideo;
  }
  
  return out;
}
