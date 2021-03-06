import React from 'react';

import { Grid, Button, Comment, Header, Form, List, Segment, Icon, Label } from 'semantic-ui-react'
import { Pages } from "../pages.js";
import Chart from 'react-apexcharts'
import style from "../../css/policyContent.module.css"
import { trackPromise } from 'react-promise-tracker';

import person from "../../imgs/person.png"
import { FaceHappy, FaceNeutral, FaceSad } from 'akar-icons';
import { ProposalR } from "../request/proposalR"
import { InfoModal, ReportModal } from "../modal"




import { Worker, Viewer } from '@react-pdf-viewer/core';

import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';




class PolicyContent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            "login": !!localStorage.getItem("login"),
            userName: localStorage.getItem("login"),
            reportModal: false,
            kpi: {
                series: [10, 50, 40],
                options: {
                    colors: ['#95c95d', '#e3e53a', '#e52125'],
                    labels: ["同意", "中立", "反對"],
                    chart: { width: 50 }
                },
            },
            data: [
                {
                    title: "公民投票法部分條文修正草案",
                    tag: ["金融", "國防"], date: "2020/11/22",
                    message: []
                },

            ],
            vote: { title: "我是標題", content: "我是內文", tag: ["金融", "國防"], vote: [43, 53, 4] },
            voteValue: [null],
            proposalId: props.match.params.id,
            open: false,
            proposal: localStorage.getItem("proposal")
        }
    }
    componentDidMount() {
        this.getMsg()
        window.scrollTo(0, 0)
    }
    showNoteModal = (m) => {

        this.setState({ open: !this.state.open, noteModalC: m })
    }
    closeNoteModal = () => {
        this.setState({ noteModal: false })

    }
    vote = () => {
        trackPromise(
            ProposalR.vote({ user_id: this.state.userName, sp_id: this.state.voteValue, proposal_id: this.state.proposalId }).then(response => {
                console.log(response)
                if (response.data.success) {
                    this.showNoteModal("投票成功")
                }
            })
        )

    }
    voteChange = (val) => this.setState({ voteValue: val });

    getMsg = () => {
        trackPromise(
            ProposalR.msgList(this.state.proposalId, { "user_id": this.state.login }).then(response => {
                console.log(response.data)
                let msgL = (response.data.data[0].data)
                let detail = (response.data.data[1].data)
                let heart = (response.data.data[2].data === [])
                let rule = (response.data.data[3].data)
                this.setState({ detail: detail, heart: false, msgL: msgL, rule: rule })
            })
        )


    }

    msg = () => {
        let msg = document.getElementById("msg")
        console.log(msg.value)
        ProposalR.msg({ user_id: this.state.userName, content: msg.value, article_id: this.state.proposalId, parent_id: 0 }).then(response => {
            if (response.data.success) {
                msg.value = ""
                this.getMsg()
                this.showNoteModal("留言成功")

            }
        })
    }
    showReport = (msgid) => {
        
        if (!this.state.ReportModal) {
            this.setState({
                reportModal: !this.state.reportModal,
              
                msgid: msgid
            })
        }
        else {
            this.setState({
                reportModal: !this.state.reportModal,
                msgid: null
            })
        }

    }
    report = () => {
        let ruleInput = []
        for (let i of this.state.rule) {
            if (document.getElementById(`reportInput-${i.id}`).checked) ruleInput.push(i.id)
        }
        let remark = document.getElementById("reportInputRemark").value || " "
        console.log(this.state.msgid)
        // ProposalR.report({ user_id: this.state.userName, message_id: this.state.msgid, remark: remark, rule: ruleInput }).then(response => {
        //     console.log(response)
        // })
    }

    save = () => {
        if (this.state.heart) { }
        this.setState({ heart: !this.state.heart })
        ProposalR.save({ "user_id": this.state.userName, "proposal_id": this.state.proposalId }).then(res => {
            console.log(res)
        })
    }


    render() {
        console.log(this.state.msgL)
        console.log(this.state.detail)
        console.log(this.state.heart)
        return (<Pages id={ 2 }
            pageInfo={ [{ content: '提案專區', link: true, href: "./#/Policy" },
            { content: this.state.detail && this.state.detail.title, active: true, href: `./#/PolicyContent/${this.state.proposalId}` }] }
            page={
                (<>{ }
                    { this.state.detail != null ? (<>

                        <div>
                            <div className={ style.topicBold }>{ this.state.detail.title }</div>
                            <Segment basic>
                                <List horizontal>

                                    <List.Item ><Header>提案人</Header></List.Item>
                                    { this.state.detail.name.map(item => { return (<List.Item ><Label> { item }</Label></List.Item>) }) }
                                </List>


                            </Segment>
                            <Label.Group>
                                { this.state.detail.category.map(item => { return (item != null ? <Label>{ item }</Label> : <></>) }) }
                            </Label.Group>


                            <div>

                            </div>
                            <Grid> <Grid.Row >
                                {/* <Grid.Column className={ style.lable } >{ placement.date }</Grid.Column> */ }
                                {/* { placement.tag.map(item => (<Grid.Column  className={ style.lable }>#{item }</Grid.Column>)) } */ }
                                <Grid.Column width={ 16 }>

                                </Grid.Column>
                                <Grid.Column width={ 16 } >
                                    <div>
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">


                                        </Worker>
                                        <div
                                            style={ {
                                                border: '1px solid rgba(0, 0, 0, 0.3)',
                                                height: '750px',
                                            } }
                                        >
                                            <Viewer fileUrl={ `https://cors-anywhere.herokuapp.com/${this.state.detail.pdfUrl}` }
                                            //   plugins={[
                                            //     pageNavigationPluginInstance,
                                            // ]}
                                            />
                                        </div>
                                    </div>

                                    {/* <PdfComponent uu={placement.pdfUrl}/> */ }
                                </Grid.Column>
                                <Grid.Column width={ 16 }>
                                    { this.state.login && <><Icon name={ "heart" } className={ this.state.heart ? style.redHeart : style.heart } onClick={ this.save } />
                                        { this.state.heart ? "已收藏" : "收藏" }
                                    </> }


                                </Grid.Column>



                            </Grid.Row></Grid>


                        </div>

                    </>) : (<></>) }
                    <Grid>
                        <Grid.Row>
                            { this.state.login && (<Grid.Column width={ 16 }>
                                <Segment>
                                    <Header>提案進度</Header>
                                    <List horizontal>

                                        <List.Item>交付審查</List.Item>
                                        <List.Item icon={ "angle right" } />
                                        <List.Item>退回程序</List.Item>
                                    </List>
                                    <Grid >
                                        <Grid.Row columns={ "equal" }>
                                            <Grid.Column>
                                                <div className={ style.lable }>
                                                    <p>您的看法：</p><p>(請點選投票)</p>
                                                </div>
                                                <Button.Group >
                                                    <Button toggle basic inverted color='green' content={ <FaceHappy className={ style.green + " " + style.size } /> } />

                                                    <Button.Or />
                                                    <Button toggle basic inverted color='yellow' content={ <FaceNeutral className={ style.yellow + " " + style.size } /> } />
                                                    <Button.Or />
                                                    <Button toggle basic inverted color='red'><FaceSad className={ style.red + " " + style.size } /></Button>

                                                </Button.Group>

                                                <Button onClick={ this.vote }> 確定投票</Button>
                                            </Grid.Column>
                                            <Grid.Column floated={ "right" }>
                                                <div className={ style.lable }>RUN民看法：</div>
                                                <div style={ { width: "300px", hgieht: "300px" } }><Chart options={ this.state.kpi.options } series={ this.state.kpi.series } type="donut" /></div>
                                            </Grid.Column>

                                        </Grid.Row>
                                    </Grid>  </Segment>

                            </Grid.Column>) }


                            <Grid.Column width={ 16 }>
                                <Segment>
                                    <Comment.Group >
                                        <Header as='h3' dividing>RUN民討論專區</Header>
                                        { this.state.msgL || false ? (this.state.msgL.map((placement, index) => {
                                            return (<>
                                                <Comment>
                                                    <Comment.Avatar src={ person } />
                                                    <Comment.Content>
                                                        <Comment.Author as={ "span" }>{ placement.user_id }</Comment.Author>
                                                        <Comment.Metadata>{ placement.time }</Comment.Metadata>
                                                        <Comment.Text>{ placement.content }</Comment.Text>
                                                        <Comment.Actions>
                                                            <Comment.Action>回覆</Comment.Action>

                                                            <ReportModal btn={ (<Comment.Action>檢舉</Comment.Action>) }
                                                                rule={ this.state.rule }toDo={this.report}
                                                            />

                                                        </Comment.Actions>
                                                    </Comment.Content>
                                                </Comment>
                                            </>)
                                        })) : <></> }
                                        { this.state.login && <>
                                            <Form reply>
                                                <Form.TextArea rows={ 1 } className={ style.input } id="msg" />
                                                <Button content='發佈' labelPosition='left' icon='edit' primary onClick={ this.msg } />
                                            </Form>
                                        </> }

                                    </Comment.Group></Segment>
                                <div className={ style.mes }>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <InfoModal open={ this.state.open } content={ this.state.noteModalC } close={ this.showNoteModal } />
                </>)
            } />)
    }
}





export default PolicyContent = {
    routeProps: {
        path: "/PolicyContent/:id",
        component: PolicyContent
    },
    name: "提案內容"
}
