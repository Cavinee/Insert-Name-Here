import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 15,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor:
        'white',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor:
        '#34D399',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  backgroundColor: 'white',
  zIndex: 1,
  color: '#34D399',
  width: 30,
  height: 30,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundColor:
          'white',
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundColor:
          '#34D399',
      },
    },
  ],
}));

function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className, icon } = props;
  
    // Define color logic: green for not completed, white for completed
    const iconStyle: React.CSSProperties = {
      color: completed ? 'white' : '#34D399',  // Completed steps are white, others are green
      backgroundColor: 'transparent',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
  
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        <span style={iconStyle}>{icon}</span>
      </ColorlibStepIconRoot>
    );
  }

const steps = ['Account Type', 'Basic Info', 'Profile', 'Wallet', 'Review'];

interface CustomizedSteppersProps {
    step: number; // The current step number
  }

export default function CustomizedSteppers({ step }: CustomizedSteppersProps) {
    return (
        <Stack sx={{ width: '100%' }} spacing={4}>
        <Stepper alternativeLabel activeStep={step} connector={<ColorlibConnector />}>
            {steps.map((label) => (
            <Step key={label}>
                <StepLabel
                StepIconComponent={ColorlibStepIcon}
                sx={{
                    '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel':
                    {
                        color: 'white', // Just text label (COMPLETED)
                        marginTop: "1rem"
                    },
                }}
                >
                {label}
                </StepLabel>
            </Step>
            ))}
        </Stepper>
        </Stack>
    );
}

  