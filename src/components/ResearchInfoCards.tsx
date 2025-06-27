import { Card } from "antd";
const cards = [
    {
        title: '论文',
        text: '这里是一些论文的展示',
    },
    {
        title: '数据集',
        text: '这里是一些数据集的展示',
    },
    {
        title: '专利',
        text: '这里是一些专利的展示',
    },
]
export default function ResearchInfoCards() {
  return (
      <>
          <div className={'wrapper'}>
              <video src={'/科学数据.mp4'} autoPlay muted loop id={'video'}></video>
              <div id={'info-cards'} className={'flex flex-col items-center'}>
                  <h1 className={'text-4xl text-white font-bold py-4'}>xxx课题组的数据汇交</h1>
                  <div className={'flex gap-8'}>
                      {cards.map((item, index)=>(
                          <Card key={index} title={item.title} hoverable>
                              <p>{item.text}</p>
                          </Card>
                      ))}
                  </div>
              </div>
          </div>
          <style jsx>{`
                #wrapper {
                    position: relative;
                }
                #info-cards {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
            `}</style>
      </>
  );
}