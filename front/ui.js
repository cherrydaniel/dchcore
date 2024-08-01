import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import theme from './theme.js';

const animationRotate = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

export const Box = styled.div`
    ${p=>p.width ? `width: ${p.width};` : ''}
    ${p=>p.height ? `height: ${p.height};` : ''}
    ${p=>p.maxWidth ? `max-width: ${p.maxWidth};` : ''}
    ${p=>p.maxHeight ? `max-height: ${p.maxHeight};` : ''}
    ${p=>p.minWidth ? `min-width: ${p.minWidth};` : ''}
    ${p=>p.minHeight ? `min-height: ${p.minHeight};` : ''}
    ${p=>p.padding ? `padding: ${p.padding};` : ''}
    ${p=>p.paddingTop ? `padding-top: ${p.paddingTop};` : ''}
    ${p=>p.paddingBottom ? `padding-bottom: ${p.paddingBottom};` : ''}
    ${p=>p.paddingLeft ? `padding-left: ${p.paddingLeft};` : ''}
    ${p=>p.paddingRight ? `padding-right: ${p.paddingRight};` : ''}
    ${p=>p.margin ? `margin: ${p.margin};` : ''}
    ${p=>p.marginTop ? `margin-top: ${p.marginTop};` : ''}
    ${p=>p.marginBottom ? `margin-bottom: ${p.marginBottom};` : ''}
    ${p=>p.marginLeft ? `margin-left: ${p.marginLeft};` : ''}
    ${p=>p.marginRight ? `margin-right: ${p.marginRight};` : ''}
    ${p=>p.textSize ? `font-size: ${theme.fontSize[p.textSize]};` : ''}
    ${p=>p.rtl ? `direction: rtl;` : ''}
    ${p=>p.fontWeight ? `font-weight: ${p.fontWeight};` : ''}
    ${p=>p.fontStyle ? `font-style: ${p.fontStyle};` : ''}
    ${p=>p.color ? `color: ${p.color};` : ''}
    ${p=>p.backgroundColor ? `background-color: ${p.backgroundColor};` : ''}
`;

export const Flex = styled(Box)`
    display: flex;
    ${p=>p.flexDirection ? `flex-direction: ${p.flexDirection};` : ''}
    ${p=>p.flexWrap ? `flex-wrap: ${p.flexWrap};` : ''}
    ${p=>p.flexGrow ? `flex-grow: ${p.flexGrow};` : ''}
    ${p=>p.justifyContent ? `justify-content: ${p.justifyContent};` : ''}
    ${p=>p.alignItems ? `align-items: ${p.alignItems};` : ''}
    ${p=>p.gap ? `gap: ${p.gap};` : ''}
`;

export const ResponsiveFlex = styled(Flex)`
    @media (max-width: ${theme.screen.tablet}) {
        flex-direction: column;
        justify-content: center;
    }
`;

// export const Image = styled(props=>{
//     let {className, src, filename, imgStyle, ...rest} = props;
//     return <Flex justifyContent='center' className={className} {...rest}>
//       <img src={filename ? `${config('IMAGEKIT_ENDPOINT')}${filename}` : src}
//         style={{width: '100%', ...imgStyle}}/>
//     </Flex>;
// })`
//     &>img {
//         ${p=>p.circle ? `border-radius: 50%;` : p.rounded ? `border-radius: 10px;` : ''}
//         ${p=>p.objectFit ? `object-fit: ${p.objectFit};` : ''}
//         ${p=>p.shadow ? `box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);` : ''}
//     }
// `;

export const Icon = props=><i className={`${props.className || ''} ${props.name || ''}`}></i>;

export const Button = styled(props=>{
    let {className, text, icon, iconReverse, variant, size='M', loading, disabled, onClick} = props;
    return <Flex className={className} flexDirection={iconReverse ? 'row-reverse' : 'row'} padding={theme.spacing.M} margin={theme.spacing.M}
      width='fit-content' gap={theme.spacing.M} alignItems='center' textSize={size} onClick={()=>!disabled&&!loading&&onClick?.()}>
      {loading ? <Spinner textSize={size}
        color={disabled||loading ? theme.color.gray2 : variant=='secondary' ? theme.color.accent1 : theme.color.white}/>
        : icon && <Icon name={icon}/>}
      {text && <Box textSize={size}>{text}</Box>}
    </Flex>;
})`
    color: ${p=>p.disabled||p.loading ? theme.color.gray2 
        : p.variant=='secondary' ? theme.color.accent1
        : theme.color.white};
    background-color: ${p=>p.disabled||p.loading ? theme.color.gray1 
        : p.variant=='secondary' ? theme.color.white 
        : theme.color.accent1};
    border: 2px solid ${p=>p.disabled||p.loading ? theme.color.gray2
        : p.variant=='secondary' ? theme.color.accent1
        : theme.color.accent1};
    border-radius: 10px;
    cursor: ${p=>p.disabled ? 'not-allowed' : p.loading ? 'wait' : 'pointer'};
    &:hover {
        color: ${p=>p.disabled||p.loading ? theme.color.gray2 
            : p.variant=='secondary' ? theme.color.accent2
            : theme.color.white};
        background-color: ${p=>p.disabled||p.loading ? theme.color.gray1
            : p.variant=='secondary' ? theme.color.white
            : theme.color.accent2};
        border: 2px solid ${p=>p.disabled||p.loading ? theme.color.gray2
            : p.variant=='secondary' ? theme.color.accent2
            : theme.color.accent2}
    }
`;

// export const Page = styled(props=>{
//     const {children, docTitle, ...rest} = props;
//     const {setTitle} = useAppContext();
//     useEffect(()=>{
//         if (!docTitle)
//             return;
//         const unsetTitle = setTitle(docTitle);
//         return ()=>unsetTitle();
//     }, [setTitle, docTitle]);
//     return <Flex flexDirection='column' width='100vw' height='100vh' {...rest}>
//       {children}
//     </Flex>;
// })`
//     ${p=>p.bgFilename ? `background-image: url(${config('IMAGEKIT_ENDPOINT')}${p.bgFilename});` : ''}
//     background-size: cover;
//     background-color: ${theme.color.white};
//     color: ${theme.color.black};
//     position: fixed;
//     overflow-y: scroll;
// `;

export const Section = props=>{
    
};

export const Panel = styled(props=>{
    const {children, ...rest} = props;
    return <Box padding={theme.spacing.XXL}>
      <Flex maxWidth='800px' padding='10px' margin='0 auto' color={theme.color.black} backgroundColor={theme.color.white} {...rest}>
        {children}
      </Flex>
    </Box>
})`
    border-radius: 25px;
`;

export const Header = styled(Box)`
    font-weight: bold;
`;

export const Span = styled.span`
    ${p=>p.highlight ? `background-color: ${p.highlight};` : ''}
`;

export const Label = props=>{

};

export const Link = props=>{

};

export const Spinner = styled(Box)`
    width: ${p=>p.textSize ? theme.fontSize[p.textSize] : theme.fontSize.M};
    height: ${p=>p.textSize ? theme.fontSize[p.textSize] : theme.fontSize.M};
    border: ${p=>['S', 'XS'].includes(p.textSize) ? 2 : 5}px solid ${p=>p.color || theme.color.white};
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: ${animationRotate} 1s linear infinite;
`;

export const Input = styled.input`
    color: ${theme.color.black};
    background-color: ${theme.color.white};
    padding: ${theme.spacing.S};
    border: 1px solid ${p=>p.variant=='error' ? theme.color.err1 : theme.color.black};
    border-radius: 10px;
`;

export const Checkbox = styled(forwardRef((props, ref)=>{
    const {size='L', checked=false, onChange, error, label, ...rest} = props;
    const [_checked, setChecked] = useState(!!checked);
    if (ref)
        ref.current = {checked};
    useEffect(()=>{
        if (ref)
            ref.current.checked = _checked;
        onChange?.(_checked);
    }, [_checked]);
    const toggle = useCallback(()=>{
        setChecked(prev=>!prev);
    }, []);
    return <Flex justifyContent='center' gap={theme.spacing.S} onClick={toggle} {...rest}>
      <Flex className='chk' width={theme.fontSize[size]} height={theme.fontSize[size]} style={{
          ...!!_checked && {
              border: `3px solid ${theme.color.accent1}`,
              color: theme.color.accent1,
          },
          ...!!error && {
              border: `3px solid ${theme.color.err1}`,
              color: theme.color.err1,
          },
      }}>
        {_checked && <Icon name='fas fa-check'/>}
      </Flex>
      {label && <Flex className='lbl' fontWeight='bold' style={{
        ...error && {color: theme.color.err1},
      }}>{label}</Flex>}
    </Flex>
}))`
    &:hover {
        &>.chk {
            color: ${theme.color.accent2} !important;
            border: 3px solid ${theme.color.accent2} !important;
        }
        &>.lbl {
            color: ${theme.color.accent2} !important;
        }
    }
    &>.chk {
        border: 3px solid ${theme.color.black};
        color: ${theme.color.black};
        border-radius: 10px;
        justify-content: center;
        align-items: center;
    }
`;

export const TextField = forwardRef((props, ref)=>{
    const {label, icon, required, onChange, error, ...rest} = props;
    if (ref)
        ref.current = {};
    const inputRef = useRef(null);
    const _onChange = useCallback(()=>{
        if (ref)
            ref.current.value = inputRef.current.value;
        onChange?.(inputRef.current.value);
    }, [ref, onChange]);
    return <Flex flexDirection='column' gap={theme.spacing.M} marginTop={theme.spacing.M} marginBottom={theme.spacing.M}>
      {label && <Flex fontWeight='bold'>{label}</Flex>}
      <Flex alignItems='center' gap={theme.spacing.S}>
        {icon && <Icon name={icon}/>}
        <Input {...error && {variant: 'error'}} ref={inputRef} onChange={_onChange} {...rest}/>
      </Flex>
      {error && <Flex textSize='S' color={theme.color.err1}>{error}</Flex>}
    </Flex>
});

