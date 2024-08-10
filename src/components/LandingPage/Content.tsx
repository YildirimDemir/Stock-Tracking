import Style from './content.module.css';

export default function Content() {
  return (
    <div className={Style.homeContent}>
        <h1>IT'S EASIER NOW</h1>
        <div className={Style.homeContentBoxes}>
            <div className={Style.homeContentBox}>
              <h2>Easy Management</h2>
              <p>Create your account and easily manage your stocks and items without the hassle of Excel or complex software. Our userfriendly interface ensures quick and efficient stock tracking.</p>
            </div>
            <div className={Style.homeContentBox}>
              <h2>Quick Stock Creation</h2>
              <p>Creating new stock lists has never been easier. Add and update your stocks with just a few clicks. Customize and organize your stocks with various categories and details.</p>
            </div>
            <div className={Style.homeContentBox}>
              <h2>Detailed Item Tracking</h2>
              <p>Add as many items as you need to each stock. Track your products in detail, update stock levels, prices, and other important information. Save time and costs with all data in one place.</p>
            </div>
        </div>
    </div>
  )
}
