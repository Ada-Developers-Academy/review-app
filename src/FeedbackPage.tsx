import { RouteComponentProps } from 'react-router-dom';
import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Main, Header1, BodyText, BodyTextLink, BodyOL } from './sharedStyleComponents';
import { Grade } from './fetchFromFirebase';
import { colors, fonts } from './designTokens';
import { Spacer, InlineSpacer } from './Spacer';
import { useFetchFromGithub } from './fetchFromGithub';

interface FeedbackPageParams {
    id: string,
    org: string,
    repo: string,
}

interface FeedbackPageProps extends RouteComponentProps<FeedbackPageParams> {

}

interface PrData {
    label: string,
    repo: string,
    href: string,
    authorUsername: string,
    commentNumber: number,
    feedbackMarkdown: string,
    grade: Grade | null,
}

const mockFeedbackMarkdown = `
**Core Requirements**
Git hygiene |
Comprehension questions |

**Functionality**
Click a button to load and view a list of trips |
Clicking the "load" button twice does not cause each trip to display twice |
Click a trip to load and view trip details |
Clicking a different trip loads different details |
Open network tab, then fill out a form to reserve a spot |
Submitting the form only sends one POST request |
Errors are reported to the user |
Site is clearly laid out and easy to navigate |

**Under the Hood**
Callback functions are not nested more than 2 levels deep |
`;

const mockPrData: PrData = {
    label: `#45 - This is my PR title`,
    repo: `Ada-11/Trek`,
    href: `https://github.com/Ada-C11/trek/pull/45`,
    authorUsername: `somegithubusername`,
    commentNumber: 1,
    feedbackMarkdown: mockFeedbackMarkdown,
    grade: null,
}

function useFetchPrData(org: string, repo: string, prId: string,) {
    const path = `repos/${org}/${repo}/pulls/${prId}`
    const {data, error, isLoading} = useFetchFromGithub<PrData>(path);
    return {
        prData: data,
        isLoading: isLoading,
        error
    }
}

function useMockPrData(prId: string,) {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [prData, setPrData] = React.useState<PrData | null>(null);
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setPrData(mockPrData);
            setIsLoading(false);
        }, 1000);
    }, [prId]);

    return { mockData: prData, mockIsLoading: isLoading };
}

const Subtitle = styled(`h2`)({
    fontSize: 16,
    fontWeight: 600,
    color: colors.nearBlack,
    textTransform: `uppercase`,
    padding: 0,
    margin: 0,
});

const TitleLayout = styled(`div`)({
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `baseline`,
});

const Title = styled(Header1)({
    marginTop: 0,
});

const PrLink = styled(BodyTextLink)({
    textAlign: `right`,
});

const StyledOrderedList = styled(BodyOL)({
   marginTop: 30,
   marginBottom: 30,
});

const FeedbackForm = styled(`textarea`)({
    borderColor: colors.teal20,
    borderWidth: 1,
    borderStyle: `solid`,
    borderRadius: 8,
    backgroundColor: colors.gray10,
    resize: `vertical`,
    width: `100%`,
    height: 400,
    fontSize: 16,
    lineHeight: 1.5,
    fontFamily: fonts.ptMono,
    padding: 20,
    boxSizing: `border-box`,
    '::-webkit-scrollbar': {
        width: 20,
        paddingRight: 5,
    },
    '::-webkit-scrollbar-track': {
        backgroundColor: `transparent`,
    },
    '::-webkit-scrollbar-thumb': {
        backgroundColor: colors.teal20,
        borderRadius: 10,
        border: `8px solid rgba(255,255,255,0)`,
        backgroundClip: `padding-box`,
    },
});

const FormBottomBar = styled(`div`)({
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
});

const FormBottomBarLeft = styled(`div`)({

});

const FormBottomBarRight = styled(`div`)({
    display: `flex`,
    alignItems: `center`,
});

const CommentIndicatorRoot = styled(`span`)({
    color: colors.teal100,
});

const ReloadButton = styled(`button`)({
    color: colors.pumpkin100,
    backgroundColor: `transparent`,
    outline: `none`,
    cursor: `pointer`,
    fontFamily: fonts.openSans,
    border: `none`,
    fontSize: `inherit`,
    padding: 0,
});

const CommentIndicator: React.FC<{ hasComment: boolean, refreshData: () => void }> = ({ hasComment, refreshData }) => (
    <CommentIndicatorRoot>
        <FontAwesomeIcon icon={hasComment ? faCheckCircle : faCircle}/>
        <InlineSpacer width='.5em'/>
        Inline comment posted on PR
        {!hasComment &&
            <React.Fragment>
                <InlineSpacer width='.75em'/>|<InlineSpacer width='.75em'/>
                <ReloadButton onClick={refreshData}>Check GitHub</ReloadButton>
            </React.Fragment>
        }
    </CommentIndicatorRoot>
);

// TODO: fill out this component
const GradeSelector: React.FC<{ grade: Grade | null, onChange: (newGrade: Grade) => void}> = ({ grade, onChange }) => (
    <div>Grade this Pull Request</div>
);

const SubmitButton = styled(`button`)({
    backgroundColor: colors.teal100,
    color: colors.white,
    fontSize: 16,
    fontWeight: 600,
    borderColor: colors.teal100,
    borderRadius: 8,
    borderSize: 1,
    paddingTop: 9,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    cursor: `pointer`,
    ':hover': {
        backgroundColor: colors.tealDark,
        borderColor: colors.tealDark,
    },
    ':disabled': {
        cursor: `not-allowed`,
        color: colors.teal20,
        backgroundColor: colors.gray10,
        borderColor: colors.teal20,
    },
});

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ match }) => {
    const org = match.params.org;
    const repo = match.params.repo;
    const prId = match.params.id;
    // TODO: use real data here
    const { mockData, mockIsLoading } = useMockPrData(prId);
    const { prData, isLoading } = useFetchPrData(org, repo, prId);
    console.log(prData, "DATA")
    const [feedbackFormText, setFeedbackFormText] = React.useState(mockData && mockData.feedbackMarkdown || ``);

    React.useEffect(() => {
        setFeedbackFormText(mockData && mockData.feedbackMarkdown || ``);
    }, [prId, mockData]);

    const handleFeedbackFormInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeedbackFormText(e.target.value);
    };

    // TODO: make these do something
    const refreshData = () => undefined;
    const handleGradeChange = (newGrade: Grade) => undefined;
    const submitFormData = () => undefined;

    function getContents() {
        if (isLoading) {
            return <BodyText>Loading...</BodyText>;
        }
        if (!mockData) {
            return <BodyText>Nothing to show here</BodyText>;
        }
        return (
            <React.Fragment>
                <Subtitle>{prData && prData.repo}</Subtitle>
                <TitleLayout>
                    <Title>{prData && prData.label}</Title>
                    <PrLink>{prData && prData.href}</PrLink>
                </TitleLayout>
                <BodyText>
                    Providing complete feedback on a student’s work involves three distinct steps:
                </BodyText>
                <StyledOrderedList>
                    <li>Give inline feedback by <BodyTextLink href={prData && prData.href}>commenting on the pull request on GitHub</BodyTextLink>.</li>
                    <li>Edit the markdown field below, providing your feedback on the features listed.</li>
                    <li>Assign an overall grade (green, yellow, red) for this PR.</li>
                </StyledOrderedList>
                <BodyText>
                    Once all three are complete, you can click the Submit Feedback button at the bottom of this page.
                </BodyText>
                <FeedbackForm value={feedbackFormText} onChange={handleFeedbackFormInput}/>
                <Spacer height={21}/>
                <FormBottomBar>
                    <FormBottomBarLeft>
                        <CommentIndicator
                            hasComment={prData && prData.comments}
                            refreshData={refreshData}
                        />
                    </FormBottomBarLeft>
                    <FormBottomBarRight>
                        <GradeSelector grade={mockData && mockData.grade} onChange={handleGradeChange}/>
                        <Spacer width={20}/>
                        <SubmitButton
                            disabled={prData && !prData.comments}
                            onClick={submitFormData}
                        >
                            Submit Feedback
                        </SubmitButton>
                    </FormBottomBarRight>
                </FormBottomBar>
            </React.Fragment>
        )
    }
    return (
        <Main>
            {getContents()}
        </Main>
    );
};
