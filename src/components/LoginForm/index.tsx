import React, { useState, ChangeEvent, FormEvent, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/user-context';
import Modal from "../../components/Modal";
import logo from "../../assets/img/logo-uolkut-simples.svg";
import {
    CreateAccountButton,
    CustomCheckboxInput,
    CustomCheckboxLabel,
    EmailInput,
    BirthDateInput,
    ProfessionInput,
    CountryInput,
    CityInput,
    RelationshipSelect,
    ErrorContainer,
    ErrorMessage,
    ForgotPasswordLink,
    ForgotPasswordLinkb,
    Form,
    LoginButton,
    LoginFormContainer,
    LoginTitle,
    LogoImage,
    PasswordInput,
    RememberMeContainer,
    RememberMeText,
} from './style';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [profession, setProfession] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [relationship, setRelationship] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoginAttempted, setIsLoginAttempted] = useState(false);
    const [rememberPassword, setRememberPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const { setUserIsLogged, modalIsVisible, setModalIsVisible } = useContext(UserContext)!;
    const [isRegistrationForm, setIsRegistrationForm] = useState(false);
    const [registrationError, setRegistrationError] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');


    useEffect(() => {
        setUserIsLogged(false);
    }, [setUserIsLogged]);

    // Handle the login process. Validates the email and password, displays errors if needed, and handles successful login. Is called when the form is submitted.
    const handleLogin = () => {
        if (!email || !password || !isValidEmail(email)) {
            setIsLoginAttempted(true);
            setEmailError(email ? (isValidEmail(email) ? '' : 'Formato de e-mail inválido.') : 'Campo de e-mail não pode ser vazio.');
            setPasswordError(password ? '' : 'Campo de senha não pode ser vazio.');
            setLoginError('');
        } else {
            setIsLoginAttempted(false);
            setEmailError('');
            setPasswordError('');
            setLoginError('');
            setUserIsLogged(true);
            navigate('/profile');
        }
    };

    // Validates the email format. Returns true if the email is valid, otherwise false.
    const isValidEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const isValidBirthDate = (date: string) => {
        // Verifique se a data não está no futuro. Adicione mais verificações conforme necessário.
        return new Date(date) <= new Date();
    };

    const isNotEmpty = (value: string) => {
        return value.trim() !== '';
    };

    // Handles onBlur events for the email field. Sets the email error if the form is submitted and the email field is empty.
    const handleEmailBlur = () => {
        if (isFormSubmitted) {
            setEmailError(email ? '' : 'Campo de e-mail não pode ser vazio.');
        }
    };

    // Handles onBlur events for the password field. Sets the password error if the form is submitted and the password field is empty.
    const handlePasswordBlur = () => {
        if (isFormSubmitted) {
            setPasswordError(password ? '' : 'Campo de senha não pode ser vazio.');
        }
    };

    // Handles the "Remember Me" checkbox change event. Updates the rememberPassword state based on the checkbox status.
    const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRememberPassword(e.target.checked);
    };

    // Handles form submission. Prevents default form submission and calls handleLoginOrRegister.
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsFormSubmitted(true);
        handleLoginOrRegister();
    };

    const navigate = useNavigate();

    // Navigates to the create profile page.
    const handleCreateProfile = () => {
        setIsRegistrationForm(true);
    };

    // Toggles modal visibility.
    const handleModal = () => {
        setIsForgotPassword(true);
    };

    const handleBackToLogin = () => {
        setIsForgotPassword(false);
        setIsRegistrationForm(false);
    };

    const handleRegistration = () => {
        // Validações
        if (!isValidEmail(email)) {
            setRegistrationError('Formato de e-mail inválido.');
            return;
        }

        if (!isValidBirthDate(birthDate)) {
            setRegistrationError('Data de nascimento inválida.');
            return;
        }

        if (![password, profession, country, city, relationship].every(isNotEmpty)) {
            setRegistrationError('Todos os campos são obrigatórios para o registro.');
            return;
        }

        // Aqui, você normalmente faria uma chamada API para registrar o usuário.
        // Mas para este exemplo, vamos apenas atualizar o contexto do usuário.

        setUserIsLogged(true);
        navigate('/profile');
    };

    const handleLoginOrRegister = () => {
        if (isRegistrationForm) {
            handleRegistration();
        } else {
            handleLogin();
        }
    };

    return (
        <LoginFormContainer>
            <LogoImage src={logo} alt="Logo" />

            {isForgotPassword ? (
                <>
                    <LoginTitle>Recupere sua Senha</LoginTitle>
                    <Form onSubmit={handleSubmit}>
                        <EmailInput
                            id="recoveryEmail"
                            type="text"
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                            placeholder="E-mail Cadastrado"
                        />
                        <LoginButton type="submit">Enviar código</LoginButton>
                    </Form>
                    <ForgotPasswordLink onClick={handleBackToLogin}>
                        Lembrou sua senha?
                    </ForgotPasswordLink>
                    <ForgotPasswordLinkb onClick={handleBackToLogin}className="credentials-button">
                        Entrar com as credenciais
                    </ForgotPasswordLinkb>
                </>
            ) : (
                <>
                    <LoginTitle>{isRegistrationForm ? 'Cadastre-se no UOLkut' : 'Acesse o UOLkut'}</LoginTitle>
                    <Form onSubmit={handleSubmit}>
                        <EmailInput
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={handleEmailBlur}
                            placeholder="E-mail"
                        />
                        {isLoginAttempted && emailError && (
                            <ErrorContainer>
                                <ErrorMessage>{emailError}</ErrorMessage>
                            </ErrorContainer>
                        )}

                        <PasswordInput
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={handlePasswordBlur}
                            placeholder="Senha"
                        />
                        {isLoginAttempted && passwordError && (
                            <ErrorContainer>
                                <ErrorMessage>{passwordError}</ErrorMessage>
                            </ErrorContainer>
                        )}

                        {isRegistrationForm ? (
                            <>
                                {/* Campos adicionais para o formulário de registro */}
                                <div className="inputRow">
                                    <BirthDateInput
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        placeholder="Data de Nascimento"
                                    />
                                    <ProfessionInput
                                        type="text"
                                        value={profession}
                                        onChange={(e) => setProfession(e.target.value)}
                                        placeholder="Profissão"
                                    />
                                </div>
                                <div className="inputRow">
                                    <CountryInput
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        placeholder="País"
                                    />
                                    <CityInput
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Cidade"
                                    />
                                </div>
                                <RelationshipSelect 
    value={relationship}
    onChange={(e) => setRelationship(e.target.value)}
>
    <option value="Solteiro">Solteiro</option>
    <option value="Casado">Casado</option>
    <option value="Divorciado">Divorciado</option>
    <option value="Namorando">Namorando</option>
    <option value="Preocupado">Preocupado</option>
</RelationshipSelect>
                                {isLoginAttempted && registrationError && (
                                    <ErrorContainer>
                                        <ErrorMessage>{registrationError}</ErrorMessage>
                                    </ErrorContainer>
                                )}
                                <LoginButton type="submit">Criar Conta</LoginButton>
                            </>
                        ) : (
                            <>
                                {isLoginAttempted && loginError && (
                                    <ErrorContainer>
                                        <ErrorMessage>{loginError}</ErrorMessage>
                                    </ErrorContainer>
                                )}
                                <RememberMeContainer>
                                    <CustomCheckboxInput
                                        id="rememberMe"
                                        type="checkbox"
                                        checked={rememberPassword}
                                        onChange={handleRememberMeChange}
                                    />
                                    <CustomCheckboxLabel htmlFor="rememberMe" />
                                    <label htmlFor="rememberMe">
                                        <RememberMeText>Lembrar minha senha</RememberMeText>
                                    </label>
                                </RememberMeContainer>

                                <LoginButton type="submit">Entrar na conta</LoginButton>
                                <CreateAccountButton type="button" onClick={handleCreateProfile}>
                                    Criar uma conta
                                </CreateAccountButton>
                                <ForgotPasswordLink title="Esqueci a minha senha" onClick={handleModal}>
                                    Esqueci a minha senha
                                </ForgotPasswordLink>
                            </>
                        )}
                        {modalIsVisible && <Modal imageLogo={''} text='Acesse seu e-mail e verifique suas informações.' buttonContent='Retornar à página' buttonLink="/" />}
                    </Form>
                </>
            )}
        </LoginFormContainer>
    );
}

export default LoginForm;