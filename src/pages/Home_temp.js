import React, {useState}                                    from 'react';
import {Navbar, UncontrolledCarousel}                       from "reactstrap";
import styled                                               from 'styled-components';
import AddressMap                                           from '../assets/images/team-images/map2.png'
import CourtMap                                             from '../assets/images/team-images/BusinessMapFinal.png'
import Slide1                                               from '../assets/images/team-images/HFBusiness.jpeg'
import KidTennis
                                                            from '../assets/images/team-images/sideways-kids-playing-doubles-tennis.jpg'
import "../assets/styles/HomeTemp.css"
import {BiLogIn, BsFillCaretDownFill, BsFillCaretRightFill} from "react-icons/all";
import {Link}                                               from "react-router-dom";

const Page = styled.div`
  background-color: rgba(206, 219, 245, 0.82);
`
const Footer = styled.div`
  display: flex;
  background-color: #18212f;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  justify-content: space-around;
`;
const FooterColumn = styled.div`
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;

`
const Featurette = styled.div`
  display: flex;
  justify-content: space-between;
  //box-shadow: 10px 8px 21px -9px rgba(0, 0, 0, 0.52);
  margin: 5px 0;
  align-items: center;
  border: 1px solid lightgray;
  border-radius: 6px;
  background-color: white;
  box-shadow: 0 0 5px 1px grey;

  .featuretteText {
    display: flex;
    flex: 1 1 66%;
    justify-content: center;
    text-align: center;
    font-weight: bolder;
    font-size: x-large;
  }

  img {
    max-width: 400px;
  }


`
const CollapseGroup = styled.div`
  display: flex;
  flex-direction: column;
  //box-shadow: 6px 6px 11px 1px #282c34;
  margin: 5px 0;
  border: 1px solid lightgray;
  border-radius: 6px;
  background-color: white;
  box-shadow: 0 0 5px 1px grey;

  .collapseHeader {
    border: 1px solid lightgray;
    padding-left: 5px;
    font-size: x-large;
    font-weight: bold;

  }

  .collapseContent {
    border: 1px solid lightgray;
    padding-left: 5px;
    background-color: #d9d9d9;
    font-size: large;
    box-shadow: inset 0 0 1px 1px grey;

  }
`
const StyledNavbar = styled(Navbar)`
  background-color: rgba(24, 33, 47, 0.42);
  display: flex;
  position: sticky;
  top: 0;
  z-index: 1000;
  flex-direction: row;
  justify-content: center;

  .logo {
    color: white;
    flex: 1 0 80%;
    display: flex;
    justify-content: center;
    caret-color: transparent;

  }

`
const StyledButton = styled(Link)`
  //border: .3px solid lightgray;
  border-radius: 15px;
  background-image: url('../assets/images/team-images/LoadingTennis.png');
  background-color: #18212f;
  padding: 10px 15px;
  font-weight: bold;
  cursor: pointer;
  color: white;
  caret-color: transparent;

  &:hover {
    background-color: lightgray;
    color: black;
  }
`

function Home_temp() {
    const [active, setActive] = useState('1');
    
    function toggleCollapse(collapseId) {
        if(collapseId === active) {
            setActive(null)
            return
        }
        setActive(collapseId)
    }
    
    return (
        <Page>
            
            <StyledNavbar>
                <h1 className={"logo"}>
                    Homer Ford Tennis Center
                </h1>
                <StyledButton to={"/Login"}>Sign In <BiLogIn/></StyledButton>
            </StyledNavbar>
            <div style={{
                position    : "relative",
                top         : '-85px',
                marginBottom: '-80px'
            }}>
                <UncontrolledCarousel
                    
                    items={[
                        {
                            key: 1,
                            src: CourtMap,
                        },
                        {
                            key: 2,
                            src: Slide1,
                        }
                    ]}
                />
            
            </div>
            {/*    Card Group
             
             <div style={{padding: "10px"}}>
             <CardGroup>
             <Card>
             <CardImg
             alt="Card image cap"
             src={KidsTennis}
             top
             width="100%"
             />
             <CardBody>
             <CardTitle tag="h5">
             Tennis Lessons
             </CardTitle>
             <CardSubtitle
             className="mb-2 text-muted"
             tag="h6"
             >
             For Adults And Children
             </CardSubtitle>
             <CardText>
             The Zina Garrison Academy is hosted at the Homer For Tennis Center.
             Programs are available to kids between the ages of 6 and 18.
             Tennis center lessons are available for adults.
             Please contact us at (832)-373-9798
             </CardText>
             
             </CardBody>
             </Card>
             <Card>
             <CardImg
             alt="Card image cap"
             src="https://picsum.photos/318/180"
             top
             width="100%"
             />
             <CardBody>
             <CardTitle tag="h5">
             Reservations
             </CardTitle>
             <CardSubtitle
             className="mb-2 text-muted"
             tag="h6"
             >
             Tennis Lessons
             </CardSubtitle>
             <CardText>
             Reservations can be made up to a week in advance.
             
             <table style={{width: "100%"}}>
             <tr>
             <th></th>
             <th>Prime Hours</th>
             <th>Non-Prime Hours</th>
             </tr>
             <tr>
             <td>1.5 Hours</td>
             <td>2 Hours</td>
             </tr>
             <tr>
             <td></td>
             
             </tr>
             </table>
             </CardText>
             
             </CardBody>
             </Card>
             <Card>
             <CardImg
             alt="Card image cap"
             src="https://picsum.photos/318/180"
             top
             width="100%"
             />
             <CardBody>
             <CardTitle tag="h5">
             Rentals
             </CardTitle>
             
             <CardText>
             Tennis ball machines can be rented.
             For additional equipment, please ask the front desk.
             </CardText>
             
             </CardBody>
             </Card>
             </CardGroup></div>*/}
            
            <div style={{padding: "5px"}}>
                <Featurette>
                    <div className={"featuretteText"}>
                        Tennis Lessons
                        <br/>For Adults And Children
                    </div>
                    <img src={KidTennis} alt={""}/>
                </Featurette>
                
                <CollapseGroup>
                    <h1>F.A.Q</h1>
                    <div className={"Collapse"}>
                        
                        <div className={"collapseHeader"} onClick={() => toggleCollapse('1')}>
                            {active === '1'
                                ? <BsFillCaretDownFill/>
                                : <BsFillCaretRightFill/>}Are the courts open to the public?
                        </div>
                        <div className={'collapseContent'} style={active === "1"
                            ? null
                            : {display: "none"}}>
                            Homer Ford Tennis Center is open to the public. Courts require a rental fee to use. Please
                            check-in at the Pro shop found at the front of the tennis center.
                        </div>
                    </div>
                    <div className={"Collapse"}>
                        <div className={"collapseHeader"} onClick={() => toggleCollapse('2')}>
                            {active === '2'
                                ? <BsFillCaretDownFill/>
                                : <BsFillCaretRightFill/>}What are the hours of operation?
                        </div>
                        <div className={'collapseContent'} style={active === "2"
                            ? null
                            : {display: "none"}}>
                            Weekdays: 7:30 AM – 9:00 PM
                            Weekends: 7:30 AM – 6:00 PM
                            Closed: December 25th, Thanksgiving, January 1st
                        </div>
                    </div>
                    <div className={"Collapse"}>
                        <div className={"collapseHeader"} onClick={() => toggleCollapse('3')}>
                            {active === '3'
                                ? <BsFillCaretDownFill/>
                                : <BsFillCaretRightFill/>}How can I rent a court?
                        </div>
                        <div className={'collapseContent'} style={active === "3"
                            ? null
                            : {display: "none"}}>
                            You can rent a court either in person, over the phone, or online. Reservations can be made
                            up to
                            a week in advance.
                        </div>
                    </div>
                    <div className={"Collapse"}>
                        <div className={"collapseHeader"} onClick={() => toggleCollapse('4')}>
                            {active === '4'
                                ? <BsFillCaretDownFill/>
                                : <BsFillCaretRightFill/>}Do you offer tennis lessons for adults?
                        </div>
                        <div className={'collapseContent'} style={active === "4"
                            ? null
                            : {display: "none"}}>
                            We do offer tennis lessons at our facility. Please contact the manager for more information:
                            Roger White: (832)373-8798
                        </div>
                    </div>
                    <div className={"Collapse"}>
                        <div className={"collapseHeader"} onClick={() => toggleCollapse('5')}>
                            {active === '5'
                                ? <BsFillCaretDownFill/>
                                : <BsFillCaretRightFill/>}What are the court fees?
                        </div>
                        <div className={'collapseContent'} style={active === "5"
                            ? null
                            : {display: "none"}}>
                            Prime time reservations are on weekdays after 4pm and weekends. Non-prime time is weekdays
                            before 4pm. Fees to use a court will be dependent on majority of your reservation time falls
                            under.
                            Non-prime 1h30mins: $4.00
                            Non-prime 2hrs: $5.00
                            Prime 1h30mins: $6.00
                            Prime 2hrs: $8.00
                        </div>
                    </div>
                    <div className={"Collapse"}>
                        <div className={"collapseHeader"} onClick={() => toggleCollapse('6')}>
                            {active === '6'
                                ? <BsFillCaretDownFill/>
                                : <BsFillCaretRightFill/>}Do you offer tennis lessons for kids?
                        </div>
                        <div className={'collapseContent'} style={active === "6"
                            ? null
                            : {display: "none"}}>
                            The Zina Garrison Academy is hosted at our facility; a youth tennis program that offers
                            lessons
                            to kids from ages 6-18. For more information, please visit their website at
                            https://www.zinagarrison.org/
                        </div>
                    </div>
                    <div className={"Collapse"}>
                        <div className={"collapseHeader"} onClick={() => toggleCollapse('7')}>
                            {active === '7'
                                ? <BsFillCaretDownFill/>
                                : <BsFillCaretRightFill/>}Do you offer equipment rentals?
                        </div>
                        <div className={'collapseContent'} style={active === "7"
                            ? null
                            : {display: "none"}}>
                            Current equipment that we rent out is a ball machine. For additional equipment, ask at the
                            front
                            desk.
                        </div>
                    </div>
                    <div className={"Collapse"}>
                        <div className={"collapseHeader"} onClick={() => toggleCollapse('8')}>
                            {active === '8'
                                ? <BsFillCaretDownFill/>
                                : <BsFillCaretRightFill/>}Do you have tournaments or leagues?
                        </div>
                        <div className={'collapseContent'} style={active === "8"
                            ? null
                            : {display: "none"}}>
                            We do host tournaments and leagues at our tennis center. Contact the manager for more
                            information to get involved in either one.
                            Roger White: (832)373-8798
                        </div>
                    </div>
                    <div className={"Collapse"}>
                        <div className={"collapseHeader"} onClick={() => toggleCollapse('9')}>
                            {active === '9'
                                ? <BsFillCaretDownFill/>
                                : <BsFillCaretRightFill/>}Are pets allowed at your facility?
                        </div>
                        <div className={'collapseContent'} style={active === "9"
                            ? null
                            : {display: "none"}}>
                            Pets are not allowed within the gates of our facility.
                        </div>
                    </div>
                
                </CollapseGroup>
            </div>
            
            <Footer style={{display: "flex"}}>
                <FooterColumn>
                    <b>How to Reach Us</b>
                    <p>
                        Phone: 713-842-3460
                        <br/>Address: 5225 Calhoun, 77021 Houston TX
                        <br/>
                        <br/> <b>Hours of operation:</b>
                        <br/>Weekdays: 7:30 AM – 9:00 PM
                        <br/> Weekends: 7:30 AM – 6:00 PM
                        <br/> Closed: New Years Day, Thanksgiving, Christmas Day
                    </p>
                
                </FooterColumn>
                <FooterColumn>
                    <img style={{maxWidth: "400px"}} src={AddressMap} alt={""}/>
                    <a href='https://www.freepik.com/photos/kids'>Kids photo created by freepik - www.freepik.com</a>
                
                </FooterColumn>
            
            </Footer>
        
        </Page>
    );
}

export default Home_temp;
